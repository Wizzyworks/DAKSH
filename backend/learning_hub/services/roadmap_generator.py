from datetime import datetime
from typing import List, Dict, Any, Optional
from django.utils import timezone
from django.utils.text import slugify
from accounts.models import SkillMaster
from skill_gap.models import SkillGapReport
from learning_hub.models import (
    Course,
    DynamicLearningRoadmap,
    RoadmapStage,
    StageTypeEnum,
    StageStatusEnum,
    ContentTypeEnum,
    DifficultyLevelEnum,
    RoadmapStatusEnum
)
from .resource_discovery import ResourceDiscoveryService
from .ranking_engine import PersonalizedRankingEngine


class DynamicRoadmapGeneratorService:
    """
    Synthesizes custom multi-stage learning roadmaps dynamically
    from the candidate's verified skill gap report and IRT ability score.
    """

    @classmethod
    def generate_roadmap_from_gap_report(
        cls,
        user,
        gap_report_id: Optional[str] = None,
        custom_gap_skills: Optional[List[str]] = None,
        user_theta: float = 0.0
    ) -> DynamicLearningRoadmap:
        """
        Generates and saves a personalized DynamicLearningRoadmap in PostgreSQL.
        """
        gap_report = None
        target_role_title = 'Software Development Engineer'
        gap_skills = []

        if gap_report_id:
            try:
                gap_report = SkillGapReport.objects.get(id=gap_report_id, user=user)
                if gap_report.target_role:
                    target_role_title = gap_report.target_role.role_title
                # Collect gap skills from report items
                gap_skills = [item.skill.canonical_name for item in gap_report.gap_items.all()]
            except SkillGapReport.DoesNotExist:
                pass

        if not gap_skills:
            gap_skills = custom_gap_skills or ['PostgreSQL Indexing', 'Docker Containerization', 'Node.js Concurrency', 'REST APIs']

        # Ensure active previous roadmaps are marked archived
        DynamicLearningRoadmap.objects.filter(user=user, status=RoadmapStatusEnum.ACTIVE).update(status=RoadmapStatusEnum.PAUSED)

        # 1. Create DynamicLearningRoadmap record
        roadmap_title = f"{target_role_title} Mastery Roadmap"
        roadmap = DynamicLearningRoadmap.objects.create(
            user=user,
            gap_report=gap_report,
            title=roadmap_title,
            target_role_goal=target_role_title,
            total_stages=min(8, len(gap_skills) * 2),
            completed_stages=0,
            status=RoadmapStatusEnum.ACTIVE,
            generated_by_ai=True
        )

        stage_number = 1

        # 2. Assemble dynamic stages for each gap
        for idx, skill_name in enumerate(gap_skills[:4]):
            # A. Live Discovery & Ranking for this skill
            discovered_items = ResourceDiscoveryService.discover_live_resources(skill_name)
            ranked_items = PersonalizedRankingEngine.rank_and_select_best_resources(
                discovered_items,
                topic=skill_name,
                user_theta=user_theta,
                gap_severity='High',
                top_k=1
            )

            best_resource = ranked_items[0] if ranked_items else {}
            doc_info = ResourceDiscoveryService.get_official_documentation_for_topic(skill_name)

            # Get or create SkillMaster object
            skill_slug = slugify(skill_name) or f"skill-{idx}"
            skill_obj, _ = SkillMaster.objects.get_or_create(
                slug=skill_slug,
                defaults={'canonical_name': skill_name, 'is_verified': True}
            )

            # Create or get Course record with live embed URL and official docs
            course_slug = f"course-{slugify(skill_name)}-{user_theta >= 0.5 and 'adv' or 'core'}"
            course_obj, _ = Course.objects.update_or_create(
                slug=course_slug,
                defaults={
                    'title': best_resource.get('title', f"{skill_name} Mastery & Deep Dive"),
                    'provider': best_resource.get('provider', 'YouTube / DAKSH Verified'),
                    'content_type': ContentTypeEnum.VIDEO,
                    'video_embed_url': best_resource.get('video_embed_url', 'https://www.youtube.com/embed/qw--VYLpxG4'),
                    'pdf_material_url': doc_info.get('url', 'https://devdocs.io/'),
                    'difficulty_level': DifficultyLevelEnum.ADVANCED if user_theta >= 0.5 else DifficultyLevelEnum.INTERMEDIATE,
                    'duration_minutes': 45,
                    'xp_reward': 150,
                    'tags': [skill_name, target_role_title, best_resource.get('difficulty_tier', 'Core')],
                    'is_active': True
                }
            )

            # B. Stage (2k - 1): Course Learning Module
            is_first_stage = (stage_number == 1)
            RoadmapStage.objects.create(
                roadmap=roadmap,
                stage_number=stage_number,
                title=f"Module {idx + 1}: {skill_name} Architecture & Practical Concepts",
                stage_type=StageTypeEnum.COURSE,
                course=course_obj,
                target_skill=skill_obj,
                xp_points=120,
                status=StageStatusEnum.UNLOCKED if is_first_stage else StageStatusEnum.LOCKED,
                unlocked_at=timezone.now() if is_first_stage else None
            )
            stage_number += 1

            # C. Stage (2k): In-Stage Diagnostic Quiz
            RoadmapStage.objects.create(
                roadmap=roadmap,
                stage_number=stage_number,
                title=f"Checkpoint {idx + 1}: {skill_name} Competency Verification Quiz",
                stage_type=StageTypeEnum.ASSESSMENT,
                course=None,
                target_skill=skill_obj,
                xp_points=180,
                status=StageStatusEnum.LOCKED,
                unlocked_at=None
            )
            stage_number += 1

        return roadmap
