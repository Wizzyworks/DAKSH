from datetime import datetime, timedelta
from typing import Dict, Any, List
from django.utils import timezone
from accounts.models import UserGamificationProfile, SkillMaster
from learning_hub.models import (
    RoadmapStage,
    StageStatusEnum,
    DynamicLearningRoadmap,
    RoadmapStatusEnum,
    SpacedRepetitionSchedule
)


class SpacedRepetitionService:
    """
    SuperMemo SM-2 Spaced Repetition Retention Engine.
    Schedules and adjusts review flashcards for completed concepts.
    """

    DEFAULT_EASE_FACTOR = 2.50
    MIN_EASE_FACTOR = 1.30

    @classmethod
    def schedule_initial_review(cls, user, concept_skill: SkillMaster) -> SpacedRepetitionSchedule:
        """
        Enqueues a newly completed concept into the 1-day spaced repetition queue.
        """
        next_due = timezone.now() + timedelta(days=1)
        schedule, created = SpacedRepetitionSchedule.objects.update_or_create(
            user=user,
            concept_skill=concept_skill,
            defaults={
                'current_interval_days': 1,
                'repetition_count': 0,
                'ease_factor': cls.DEFAULT_EASE_FACTOR,
                'next_review_due_at': next_due,
                'retention_streak': 0,
            }
        )
        return schedule

    @classmethod
    def record_review_result(cls, schedule: SpacedRepetitionSchedule, quality_score: int) -> SpacedRepetitionSchedule:
        """
        Applies the SM-2 algorithm based on candidate recall quality (0 to 5):
          5 - Perfect recall without hesitation
          4 - Correct response with slight pause
          3 - Correct response with serious struggle
          2 - Incorrect response, but remembered upon seeing answer
          1 - Incorrect response, completely forgotten
          0 - Total blackout
        """
        q = max(0, min(5, quality_score))
        now = timezone.now()

        # Update Ease Factor (EF)
        new_ef = float(schedule.ease_factor) + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        new_ef = max(cls.MIN_EASE_FACTOR, round(new_ef, 2))

        if q >= 3:
            # Correct recall
            if schedule.repetition_count == 0:
                new_interval = 1
            elif schedule.repetition_count == 1:
                new_interval = 3
            elif schedule.repetition_count == 2:
                new_interval = 7
            else:
                new_interval = int(schedule.current_interval_days * new_ef)

            schedule.repetition_count += 1
            schedule.retention_streak += 1
            schedule.current_interval_days = new_interval
            schedule.next_review_due_at = now + timedelta(days=new_interval)
        else:
            # Failed review -> Reset to Day 1
            schedule.repetition_count = 0
            schedule.current_interval_days = 1
            schedule.retention_streak = 0
            schedule.next_review_due_at = now + timedelta(days=1)

        schedule.ease_factor = new_ef
        schedule.last_reviewed_at = now
        schedule.save()
        return schedule

    @classmethod
    def get_due_reviews_for_user(cls, user) -> List[SpacedRepetitionSchedule]:
        """
        Returns all concept review cards due today for the user.
        """
        now = timezone.now()
        return list(
            SpacedRepetitionSchedule.objects.filter(
                user=user,
                next_review_due_at__lte=now
            ).select_related('concept_skill')
        )


class StageProgressionService:
    """
    Handles stage completion, next stage unlocking, XP rewards, and roadmap status.
    """

    @classmethod
    def complete_stage(cls, user, stage: RoadmapStage, xp_earned: int = 100) -> Dict[str, Any]:
        """
        Completes a stage, unlocks the next stage in sequence, awards XP,
        and enqueues the concept into spaced repetition.
        """
        now = timezone.now()

        # 1. Mark stage completed
        stage.status = StageStatusEnum.COMPLETED
        stage.completed_at = now
        stage.save(update_fields=['status', 'completed_at'])

        roadmap = stage.roadmap
        completed_count = roadmap.stages.filter(status=StageStatusEnum.COMPLETED).count()
        roadmap.completed_stages = completed_count

        # 2. Unlock Next Stage (if exists)
        next_stage = roadmap.stages.filter(stage_number=stage.stage_number + 1).first()
        unlocked_stage_data = None

        if next_stage:
            next_stage.status = StageStatusEnum.UNLOCKED
            next_stage.unlocked_at = now
            next_stage.save(update_fields=['status', 'unlocked_at'])
            unlocked_stage_data = {
                'stage_number': next_stage.stage_number,
                'title': next_stage.title,
                'stage_type': next_stage.stage_type
            }
        else:
            # All stages completed!
            roadmap.status = RoadmapStatusEnum.COMPLETED

        roadmap.save(update_fields=['completed_stages', 'status'])

        # 3. Award XP & update gamification profile
        gamification_prof, _ = UserGamificationProfile.objects.get_or_create(
            user=user,
            defaults={'total_xp': 0, 'current_streak_days': 1}
        )
        gamification_prof.total_xp += xp_earned
        gamification_prof.save(update_fields=['total_xp', 'updated_at'])

        # 4. Enqueue concept into Spaced Repetition if stage had a target skill
        if stage.target_skill:
            SpacedRepetitionService.schedule_initial_review(user, stage.target_skill)

        return {
            'completed_stage_number': stage.stage_number,
            'completed_stages_total': roadmap.completed_stages,
            'total_stages': roadmap.total_stages,
            'roadmap_status': roadmap.status,
            'xp_awarded': xp_earned,
            'total_user_xp': gamification_prof.total_xp,
            'next_unlocked_stage': unlocked_stage_data,
            'spaced_review_scheduled': bool(stage.target_skill)
        }
