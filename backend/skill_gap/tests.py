"""
Unit & Integration Tests for Skill Gap Analysis.
"""

import uuid
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from daksh_backend.mock_auth import TEST_USER_ID
from .models import (
    User,
    SkillMaster,
    JobRoleTaxonomy,
    RoleSkillRequirement,
    UserSkill,
    SkillGapReport,
    SkillGapItem,
    SkillCategory,
    SkillImportance,
    Proficiency,
    SkillSource,
    GapSeverity,
    ReadinessLevel,
)
from .services import calculate_skill_gap


class SkillGapAnalysisTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create(
            id=TEST_USER_ID,
            email="testuser@daksh.dev",
            password_hash="mockhash",
            role="candidate"
        )
        
        # Create test skills
        self.skill_python = SkillMaster.objects.create(
            canonical_name="Python",
            slug="python",
            category=SkillCategory.TECHNICAL
        )
        self.skill_react = SkillMaster.objects.create(
            canonical_name="React",
            slug="react",
            category=SkillCategory.TECHNICAL
        )
        self.skill_postgres = SkillMaster.objects.create(
            canonical_name="PostgreSQL",
            slug="postgresql",
            category=SkillCategory.TECHNICAL
        )
        
        # Create test target job role
        self.role_fullstack = JobRoleTaxonomy.objects.create(
            role_title="Full Stack Developer",
            role_slug="full-stack-developer",
            department_domain="Engineering"
        )
        
        # Role skill requirements
        # Python: min 75, weight 1.0, mandatory
        # React: min 80, weight 1.0, mandatory
        # Postgres: min 70, weight 1.0, preferred
        self.req_python = RoleSkillRequirement.objects.create(
            role=self.role_fullstack,
            skill=self.skill_python,
            importance=SkillImportance.MANDATORY,
            benchmark_score_min=Decimal('75.00'),
            weightage=Decimal('1.00')
        )
        self.req_react = RoleSkillRequirement.objects.create(
            role=self.role_fullstack,
            skill=self.skill_react,
            importance=SkillImportance.MANDATORY,
            benchmark_score_min=Decimal('80.00'),
            weightage=Decimal('1.00')
        )
        self.req_postgres = RoleSkillRequirement.objects.create(
            role=self.role_fullstack,
            skill=self.skill_postgres,
            importance=SkillImportance.PREFERRED,
            benchmark_score_min=Decimal('70.00'),
            weightage=Decimal('1.00')
        )
        
        # User has Python (score 80) and Postgres (score 50), missing React (score 0)
        UserSkill.objects.create(
            user=self.user,
            skill=self.skill_python,
            proficiency=Proficiency.ADVANCED,
            score=Decimal('80.00')
        )
        UserSkill.objects.create(
            user=self.user,
            skill=self.skill_postgres,
            proficiency=Proficiency.BEGINNER,
            score=Decimal('50.00')
        )

    def test_calculate_skill_gap_service(self):
        """Test calculation service logic directly"""
        report = calculate_skill_gap(user_id=str(self.user.id), target_role_id=str(self.role_fullstack.id))
        
        self.assertEqual(report.total_required_skills, 3)
        self.assertEqual(report.skills_matched_count, 1)  # Only Python meets/exceeds benchmark
        self.assertEqual(report.skills_gap_count, 2)     # Postgres & React are gaps
        
        # Achieved: min(80,75)*1 + min(50,70)*1 + min(0,80)*1 = 75 + 50 + 0 = 125
        # Total Potential: 75 + 80 + 70 = 225
        # Match % = (125 / 225) * 100 = 55.56%
        self.assertAlmostEqual(float(report.overall_match_score), 55.56, places=1)
        self.assertEqual(report.readiness_level, ReadinessLevel.CRITICAL_GAPS)
        
        # Verify items
        items = list(SkillGapItem.objects.filter(report=report))
        self.assertEqual(len(items), 3)
        
        # Check React gap item (missing mandatory skill -> Critical severity)
        react_item = next(i for i in items if i.skill == self.skill_react)
        self.assertEqual(react_item.gap_severity, GapSeverity.CRITICAL)
        self.assertEqual(float(react_item.user_current_score), 0.0)

    def test_analyze_skill_gap_api(self):
        """Test POST /api/skill-gap/analyze/ endpoint with mock auth"""
        payload = {
            "target_role_id": str(self.role_fullstack.id)
        }
        response = self.client.post('/api/skill-gap/analyze/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('overall_match_score', response.data)
        self.assertIn('items', response.data)
        self.assertEqual(len(response.data['items']), 3)

    def test_list_roles_api(self):
        """Test GET /api/skill-gap/roles/ endpoint"""
        response = self.client.get('/api/skill-gap/roles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['role_title'], 'Full Stack Developer')

    def test_get_report_detail_api(self):
        """Test GET /api/skill-gap/reports/<id>/ endpoint"""
        report = calculate_skill_gap(user_id=str(self.user.id), target_role_id=str(self.role_fullstack.id))
        response = self.client.get(f'/api/skill-gap/reports/{report.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(str(response.data['id']), str(report.id))
