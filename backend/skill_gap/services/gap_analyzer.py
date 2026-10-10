import re
from typing import List, Dict, Any, Optional
from django.utils.text import slugify
from accounts.models import SkillMaster, SkillCategoryEnum
from skill_gap.models import (
    JobRoleTaxonomy,
    RoleSkillRequirement,
    TargetJobDescription,
    SkillGapReport,
    SkillGapItem,
    GapSeverityEnum,
    ReadinessLevelEnum,
    SkillImportanceEnum,
)


class GapAnalyzerService:
    """
    Engine that computes semantic deltas between candidate profile skills
    and target role/JD requirements.
    """

    CANONICAL_SYNONYMS = {
        'react': 'React.js',
        'reactjs': 'React.js',
        'react.js': 'React.js',
        'node': 'Node.js',
        'nodejs': 'Node.js',
        'node.js': 'Node.js',
        'postgres': 'PostgreSQL',
        'postgresql': 'PostgreSQL',
        'psql': 'PostgreSQL',
        'mongo': 'MongoDB',
        'mongodb': 'MongoDB',
        'rest': 'REST APIs',
        'rest api': 'REST APIs',
        'rest apis': 'REST APIs',
        'restful': 'REST APIs',
        'dsa': 'Data Structures & Algorithms',
        'data structures': 'Data Structures & Algorithms',
        'algorithms': 'Data Structures & Algorithms',
        'aws': 'Amazon Web Services (AWS)',
        'docker': 'Docker',
        'redis': 'Redis',
        'python': 'Python',
        'django': 'Django',
        'fastapi': 'FastAPI',
        'typescript': 'TypeScript',
        'javascript': 'JavaScript',
        'git': 'Git',
    }

    @classmethod
    def normalize_skill_name(cls, raw_name: str) -> str:
        """Standardizes variations of technology names into canonical naming."""
        clean = re.sub(r'[^a-zA-Z0-9\.\s]', '', raw_name.strip().lower())
        return cls.CANONICAL_SYNONYMS.get(clean, raw_name.strip().title())

    @classmethod
    def get_or_create_skill(cls, skill_name: str, category: str = 'technical') -> SkillMaster:
        """Gets or creates canonical SkillMaster record in database."""
        canonical = cls.normalize_skill_name(skill_name)
        slug = slugify(canonical) or 'skill-' + slugify(skill_name)
        
        # Match allowed category enum
        cat_enum = SkillCategoryEnum.TECHNICAL
        if category in [c.value for c in SkillCategoryEnum]:
            cat_enum = category

        skill_obj, _ = SkillMaster.objects.get_or_create(
            slug=slug,
            defaults={
                'canonical_name': canonical,
                'category': cat_enum,
                'is_verified': True
            }
        )
        return skill_obj

    def analyze_against_role(self, user, role_slug: str, candidate_skills: List[Dict[str, Any]]) -> SkillGapReport:
        """
        Analyzes candidate skills against a preset role (e.g., sde-fullstack).
        """
        try:
            target_role = JobRoleTaxonomy.objects.get(role_slug=role_slug)
        except JobRoleTaxonomy.DoesNotExist:
            # Create a default role taxonomy if not present in DB
            target_role = JobRoleTaxonomy.objects.create(
                role_title=role_slug.replace('-', ' ').title(),
                role_slug=role_slug,
                standard_required_skills=['React.js', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Git']
            )

        # Get required skills for this role
        requirements = RoleSkillRequirement.objects.filter(role=target_role)
        if not requirements.exists():
            # Seed default requirements from standard_required_skills
            req_list = target_role.standard_required_skills or ['React.js', 'Node.js', 'PostgreSQL', 'Docker', 'Git']
            for skill_name in req_list:
                s_obj = self.get_or_create_skill(skill_name)
                RoleSkillRequirement.objects.get_or_create(
                    role=target_role,
                    skill=s_obj,
                    defaults={'importance': SkillImportanceEnum.MANDATORY, 'benchmark_score_min': 75.0, 'weightage': 1.0}
                )
            requirements = RoleSkillRequirement.objects.filter(role=target_role)

        # Build candidate skill normalized lookup map
        cand_map = {}
        for item in candidate_skills:
            norm_name = self.normalize_skill_name(item.get('name', ''))
            prof = item.get('proficiency', 'intermediate').lower()
            score = 90.0 if prof == 'advanced' else (70.0 if prof == 'intermediate' else 40.0)
            cand_map[norm_name.lower()] = {
                'original': item.get('name', ''),
                'score': score,
                'proficiency': prof
            }

        matched_count = 0
        gap_items_to_create = []
        total_weight = 0.0
        weighted_score_sum = 0.0

        for req in requirements:
            skill_canonical = req.skill.canonical_name.lower()
            weight = float(req.weightage)
            total_weight += weight

            # Check if user has this skill
            user_has_skill = False
            user_score = 0.0

            for cand_skill_lower, cand_data in cand_map.items():
                if cand_skill_lower in skill_canonical or skill_canonical in cand_skill_lower:
                    user_has_skill = True
                    user_score = cand_data['score']
                    break

            required_score = float(req.benchmark_score_min)
            delta = required_score - user_score

            if user_has_skill and delta <= 10.0:
                matched_count += 1
                weighted_score_sum += (user_score * weight)
            else:
                weighted_score_sum += (max(0.0, user_score) * weight)
                # Classify Gap Severity
                if req.importance == SkillImportanceEnum.MANDATORY:
                    severity = GapSeverityEnum.CRITICAL if not user_has_skill else GapSeverityEnum.HIGH
                else:
                    severity = GapSeverityEnum.MEDIUM if not user_has_skill else GapSeverityEnum.LOW

                action = f"Master {req.skill.canonical_name} fundamentals and complete hands-on project milestone."
                gap_items_to_create.append({
                    'skill': req.skill,
                    'user_current_score': user_score,
                    'required_score': required_score,
                    'gap_severity': severity,
                    'recommended_action': action
                })

        overall_match = round((weighted_score_sum / total_weight) if total_weight > 0 else 0.0, 2)

        # Compute Readiness Level
        if overall_match >= 85:
            readiness = ReadinessLevelEnum.READY
        elif overall_match >= 70:
            readiness = ReadinessLevelEnum.MINOR_GAPS
        elif overall_match >= 50:
            readiness = ReadinessLevelEnum.NEEDS_UP_SKILLING
        else:
            readiness = ReadinessLevelEnum.SIGNIFICANT_GAPS

        # Create Gap Report in Database
        report = SkillGapReport.objects.create(
            user=user,
            target_role=target_role,
            overall_match_score=overall_match,
            readiness_level=readiness,
            total_required_skills=requirements.count(),
            skills_matched_count=matched_count,
            skills_gap_count=len(gap_items_to_create),
            analysis_summary=f"Candidate scored {overall_match}% match against {target_role.role_title}. Identified {len(gap_items_to_create)} skill gap areas to calibrate in the Diagnostic Arena."
        )

        for gap_data in gap_items_to_create:
            SkillGapItem.objects.create(
                report=report,
                skill=gap_data['skill'],
                user_current_score=gap_data['user_current_score'],
                required_score=gap_data['required_score'],
                gap_severity=gap_data['gap_severity'],
                recommended_action=gap_data['recommended_action']
            )

        return report
