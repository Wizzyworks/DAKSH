"""
Skill Gap Calculation Service.
Implements the core matching algorithm between a candidate's skills and a target role's requirements.
"""

from decimal import Decimal
from typing import Dict, Any, List
from django.db import transaction
from .models import (
    User,
    JobRoleTaxonomy,
    RoleSkillRequirement,
    UserSkill,
    SkillGapReport,
    SkillGapItem,
    GapSeverity,
    ReadinessLevel,
    SkillImportance,
)


def calculate_skill_gap(user_id: str, target_role_id: str) -> SkillGapReport:
    """
    Calculates the skill gap analysis for a given user and target job role.
    
    1. Fetches target role skill requirements.
    2. Compares against candidate's existing user_skills.
    3. Calculates skill match percentage, gap severities, and readiness level.
    4. Persists the report in `skill_gap_reports` and item details in `skill_gap_items`.
    """
    user = User.objects.get(id=user_id)
    target_role = JobRoleTaxonomy.objects.get(id=target_role_id)
    
    requirements: List[RoleSkillRequirement] = list(
        RoleSkillRequirement.objects.filter(role=target_role).select_related('skill')
    )
    
    if not requirements:
        raise ValueError(f"No skill requirements defined for target role '{target_role.role_title}'")
    
    # Fetch user's identified skills
    user_skills_qs = UserSkill.objects.filter(user=user).select_related('skill')
    user_skills_map: Dict[str, UserSkill] = {str(us.skill_id): us for us in user_skills_qs}

    total_weighted_potential = Decimal('0.00')
    total_weighted_achieved = Decimal('0.00')
    
    matched_count = 0
    gap_count = 0
    has_critical_mandatory_gap = False
    
    items_to_create = []

    for req in requirements:
        skill_id_str = str(req.skill_id)
        benchmark_score = Decimal(str(req.benchmark_score_min))
        weightage = Decimal(str(req.weightage))
        
        req_weighted_potential = benchmark_score * weightage
        total_weighted_potential += req_weighted_potential
        
        user_skill = user_skills_map.get(skill_id_str)
        user_score = Decimal(str(user_skill.score)) if user_skill else Decimal('0.00')
        
        # Calculate score contribution capped at benchmark
        achieved_score = min(user_score, benchmark_score)
        total_weighted_achieved += (achieved_score * weightage)
        
        score_gap = benchmark_score - user_score

        # Determine severity and recommended action
        if score_gap <= Decimal('0.00'):
            matched_count += 1
            severity = GapSeverity.LOW
            action = f"Proficiency target met for {req.skill.canonical_name}. Keep practice up to date."
        else:
            gap_count += 1
            if score_gap > Decimal('50.00') or (user_score == Decimal('0.00') and req.importance == SkillImportance.MANDATORY):
                severity = GapSeverity.CRITICAL
                if req.importance == SkillImportance.MANDATORY:
                    has_critical_mandatory_gap = True
                action = f"Critical missing requirement! High-priority learning roadmap required for {req.skill.canonical_name}."
            elif score_gap > Decimal('30.00'):
                severity = GapSeverity.HIGH
                action = f"Substantial gap identified in {req.skill.canonical_name}. Complete structured projects and hands-on labs."
            elif score_gap > Decimal('15.00'):
                severity = GapSeverity.MEDIUM
                action = f"Moderate gap in {req.skill.canonical_name}. Review intermediate concepts and complete coding exercises."
            else:
                severity = GapSeverity.LOW
                action = f"Minor gap in {req.skill.canonical_name}. Quick refresher or quiz practice recommended."

        items_to_create.append({
            'skill': req.skill,
            'user_current_score': user_score,
            'required_score': benchmark_score,
            'gap_severity': severity,
            'recommended_action': action,
        })

    # Calculate Overall Match Percentage
    if total_weighted_potential > Decimal('0.00'):
        overall_match_score = (total_weighted_achieved / total_weighted_potential) * Decimal('100.00')
    else:
        overall_match_score = Decimal('0.00')

    overall_match_score = round(overall_match_score, 2)

    # Determine Overall Readiness Level
    if overall_match_score >= Decimal('85.00') and not has_critical_mandatory_gap:
        readiness_level = ReadinessLevel.JOB_READY
        summary = f"Candidate shows strong alignment ({overall_match_score}%) for {target_role.role_title}."
    elif overall_match_score >= Decimal('60.00'):
        readiness_level = ReadinessLevel.MINOR_GAPS
        summary = f"Candidate meets partial requirements ({overall_match_score}%) with minor/medium skill gaps to bridge."
    else:
        readiness_level = ReadinessLevel.CRITICAL_GAPS
        summary = f"Significant skill gaps detected ({overall_match_score}%) for {target_role.role_title}. Structured remediation recommended."

    # Persist report and items atomically
    with transaction.atomic():
        report = SkillGapReport.objects.create(
            user=user,
            target_role=target_role,
            overall_match_score=overall_match_score,
            readiness_level=readiness_level,
            total_required_skills=len(requirements),
            skills_matched_count=matched_count,
            skills_gap_count=gap_count,
            analysis_summary=summary
        )

        gap_items = [
            SkillGapItem(
                report=report,
                skill=item['skill'],
                user_current_score=item['user_current_score'],
                required_score=item['required_score'],
                gap_severity=item['gap_severity'],
                recommended_action=item['recommended_action']
            )
            for item in items_to_create
        ]
        SkillGapItem.objects.bulk_create(gap_items)

    return report
