from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import JobRoleTaxonomy, SkillGapReport, TargetJobDescription
from .serializers import JobRoleTaxonomySerializer, SkillGapReportSerializer
from .services.cv_parser import CVParserService
from .services.ai_extractor import AIExtractorService
from .services.gap_analyzer import GapAnalyzerService
from .services.diagnostic_engine import DiagnosticEngineService

User = get_user_model()


class RolesListView(views.APIView):
    """
    GET /api/skill-gap/roles/
    Returns list of preset target roles (e.g. SDE-1 Fullstack, Backend, AI/ML).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        roles = JobRoleTaxonomy.objects.filter(is_active=True)
        if not roles.exists():
            # Auto-seed preset roles if table is empty
            presets = [
                {
                    'role_title': 'Full Stack Engineer (SDE-1)',
                    'role_slug': 'sde-fullstack',
                    'department_domain': 'Engineering',
                    'standard_required_skills': ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'Git']
                },
                {
                    'role_title': 'Backend Engineer (Node/Python/Go)',
                    'role_slug': 'sde-backend',
                    'department_domain': 'Engineering',
                    'standard_required_skills': ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'SQL Indexing', 'System Design']
                },
                {
                    'role_title': 'Frontend Engineer (React/Next.js)',
                    'role_slug': 'sde-frontend',
                    'department_domain': 'Engineering',
                    'standard_required_skills': ['React.js', 'TypeScript', 'Next.js', 'TailwindCSS', 'Redux/Zustand', 'Web Performance', 'Jest']
                },
                {
                    'role_title': 'AI / ML Engineer (GenAI & Python)',
                    'role_slug': 'sde-aiml',
                    'department_domain': 'AI Labs',
                    'standard_required_skills': ['Python', 'PyTorch', 'HuggingFace', 'FastAPI', 'Vector Databases', 'LangChain', 'Data Structures']
                }
            ]
            for p in presets:
                JobRoleTaxonomy.objects.get_or_create(role_slug=p['role_slug'], defaults=p)
            roles = JobRoleTaxonomy.objects.filter(is_active=True)

        serializer = JobRoleTaxonomySerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ResumeParseView(views.APIView):
    """
    POST /api/skill-gap/parse-resume/
    Parses an uploaded CV (.pdf, .docx) or raw text and extracts structured skills via Groq LLM.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uploaded_file = request.FILES.get('resume')
        raw_text = request.data.get('raw_text', '')

        if uploaded_file:
            resume_text = CVParserService.extract_text_from_file(uploaded_file)
        elif raw_text:
            resume_text = raw_text
        else:
            return Response({'error': 'Please provide either a resume file or raw_text string.'}, status=status.HTTP_400_BAD_REQUEST)

        extractor = AIExtractorService()
        parsed_data = extractor.extract_resume_entities(resume_text)
        return Response({
            'extracted_text_snippet': resume_text[:300] + '...',
            'analysis': parsed_data
        }, status=status.HTTP_200_OK)


class BenchmarkAnalyzeView(views.APIView):
    """
    POST /api/skill-gap/analyze-benchmark/
    Compares candidate skills against target role taxonomy or custom JD text.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        if not user:
            # Fallback to test candidate if running unauthenticated
            user, _ = User.objects.get_or_create(email='candidate_demo@daksh.io', defaults={'role': 'candidate'})

        role_slug = request.data.get('role_slug', 'sde-fullstack')
        candidate_skills = request.data.get('candidate_skills', [])
        custom_jd_text = request.data.get('custom_jd_text', '')

        analyzer = GapAnalyzerService()

        if custom_jd_text:
            extractor = AIExtractorService()
            jd_data = extractor.extract_job_description_skills(custom_jd_text)
            target_jd = TargetJobDescription.objects.create(
                user=user,
                job_title=jd_data.get('job_title', 'Custom Target Role'),
                raw_jd_text=custom_jd_text,
                extracted_skills=jd_data
            )
            report = analyzer.analyze_against_role(user, role_slug, candidate_skills)
            report.target_jd = target_jd
            report.save(update_fields=['target_jd'])
        else:
            report = analyzer.analyze_against_role(user, role_slug, candidate_skills)

        serializer = SkillGapReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GenerateDiagnosticArenaView(views.APIView):
    """
    POST /api/skill-gap/generate-diagnostic/
    Generates dynamic IRT-calibrated questions for detected skill gaps.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        gap_skills = request.data.get('gap_skills', [])
        initial_difficulty = request.data.get('difficulty', 'intermediate')
        max_questions = int(request.data.get('max_questions', 5))

        engine = DiagnosticEngineService()
        questions = engine.generate_adaptive_questions(gap_skills, initial_difficulty=initial_difficulty, max_questions=max_questions)
        return Response({'questions': questions}, status=status.HTTP_200_OK)


class CalibrateDiagnosticView(views.APIView):
    """
    POST /api/skill-gap/calibrate-diagnostic/
    Runs the IRT 1PL ability estimation on candidate answers and calibrates placement readiness.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        base_match_score = float(request.data.get('base_match_score', 65.0))
        responses = request.data.get('responses', [])

        engine = DiagnosticEngineService()
        calibration_result = engine.process_adaptive_session(base_match_score, responses)
        return Response(calibration_result, status=status.HTTP_200_OK)

