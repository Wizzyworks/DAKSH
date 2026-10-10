import json
import re
import os
from django.conf import settings
from groq import Groq


class AIExtractorService:
    """
    AI Service leveraging Groq LLM (Llama 3.3 70B) for structured entity extraction
    from resumes and Job Descriptions.
    """

    def __init__(self):
        self.api_key = getattr(settings, 'GROQ_API_KEY', os.getenv('GROQ_API_KEY', ''))
        self.model = getattr(settings, 'GROQ_MODEL', os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile'))
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    def extract_resume_entities(self, resume_text: str) -> dict:
        """
        Extracts verified technical skills, experience tier, and domain knowledge from CV text.
        """
        if not self.client or not self.api_key:
            return self._heuristic_fallback_resume(resume_text)

        system_prompt = (
            "You are an expert technical recruiter and ATS parser. "
            "Analyze the given candidate resume text and extract technical skills, tools, frameworks, "
            "experience level, and career profile into strict, valid JSON format only."
        )

        user_prompt = f"""
Candidate Resume Text:
\"\"\"{resume_text[:6000]}\"\"\"

Return ONLY a JSON object matching this exact schema:
{{
  "candidate_name": "string or null",
  "experience_tier": "Fresher" | "Junior (1-2 yrs)" | "Mid-level (3-5 yrs)" | "Senior (5+ yrs)",
  "total_experience_years": number,
  "top_domains": ["string", "string"],
  "skills": [
    {{
      "name": "Canonical Skill Name (e.g. React.js, Python, PostgreSQL, Docker, Redis)",
      "category": "technical" | "tool" | "domain" | "soft",
      "proficiency": "beginner" | "intermediate" | "advanced",
      "evidence": "Short context sentence where this skill was mentioned"
    }}
  ],
  "projects": [
    {{
      "title": "Project Name",
      "technologies": ["tech1", "tech2"],
      "description": "Short 1-sentence summary"
    }}
  ],
  "ats_keywords_found": ["keyword1", "keyword2"]
}}
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            raw_content = response.choices[0].message.content
            return self._parse_json_safely(raw_content)
        except Exception as e:
            # Fallback to heuristic parser if API call fails
            return self._heuristic_fallback_resume(resume_text, error=str(e))

    def extract_job_description_skills(self, jd_text: str) -> dict:
        """
        Extracts required and preferred competencies from a target Job Description.
        """
        if not self.client or not self.api_key:
            return self._heuristic_fallback_jd(jd_text)

        system_prompt = (
            "You are a Principal Tech Lead and Hiring Architect. "
            "Analyze the provided Job Description (JD) and extract all mandatory and preferred technical skills, "
            "frameworks, required experience, and key responsibilities into strict, valid JSON."
        )

        user_prompt = f"""
Job Description Text:
\"\"\"{jd_text[:6000]}\"\"\"

Return ONLY a JSON object matching this exact schema:
{{
  "job_title": "string",
  "experience_required_years": number,
  "seniority_level": "Fresher / SDE-1" | "Mid SDE-2" | "Senior SDE-3 / Lead",
  "mandatory_skills": [
    {{
      "name": "Canonical Skill Name",
      "category": "technical" | "tool" | "domain",
      "benchmark_score": 80
    }}
  ],
  "preferred_skills": [
    {{
      "name": "Canonical Skill Name",
      "category": "technical" | "tool" | "domain",
      "benchmark_score": 60
    }}
  ],
  "core_responsibilities": ["bullet 1", "bullet 2"]
}}
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            raw_content = response.choices[0].message.content
            return self._parse_json_safely(raw_content)
        except Exception as e:
            return self._heuristic_fallback_jd(jd_text, error=str(e))

    @staticmethod
    def _parse_json_safely(raw_text: str) -> dict:
        """Strips markdown ```json fences and returns parsed python dict."""
        cleaned = re.sub(r'^```json\s*', '', raw_text.strip(), flags=re.MULTILINE)
        cleaned = re.sub(r'\s*```$', '', cleaned.strip(), flags=re.MULTILINE)
        return json.loads(cleaned)

    @staticmethod
    def _heuristic_fallback_resume(text: str, error: str = "") -> dict:
        """Deterministic keyword parser used when LLM API is offline."""
        common_tech = [
            'Python', 'JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express',
            'Django', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker',
            'Kubernetes', 'AWS', 'Git', 'REST APIs', 'GraphQL', 'HTML', 'CSS',
            'TailwindCSS', 'PyTorch', 'Data Structures', 'Algorithms'
        ]
        found_skills = []
        text_lower = text.lower()
        for tech in common_tech:
            pattern = r'\b' + re.escape(tech.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append({
                    "name": tech,
                    "category": "technical",
                    "proficiency": "intermediate",
                    "evidence": f"Found in resume content mentioning {tech}"
                })

        return {
            "candidate_name": "Candidate",
            "experience_tier": "Fresher",
            "total_experience_years": 0.5,
            "top_domains": ["Full Stack Development", "Software Engineering"],
            "skills": found_skills,
            "projects": [],
            "ats_keywords_found": [s["name"] for s in found_skills],
            "fallback_mode": True,
            "api_notice": error or "Processed using local heuristic scanner"
        }

    @staticmethod
    def _heuristic_fallback_jd(text: str, error: str = "") -> dict:
        """Deterministic JD parser used when LLM API is offline."""
        return {
            "job_title": "Software Development Engineer",
            "experience_required_years": 1.0,
            "seniority_level": "Fresher / SDE-1",
            "mandatory_skills": [
                {"name": "React.js", "category": "technical", "benchmark_score": 80},
                {"name": "Node.js", "category": "technical", "benchmark_score": 80},
                {"name": "PostgreSQL", "category": "technical", "benchmark_score": 75},
                {"name": "Data Structures", "category": "technical", "benchmark_score": 85}
            ],
            "preferred_skills": [
                {"name": "Docker", "category": "tool", "benchmark_score": 60},
                {"name": "Redis", "category": "tool", "benchmark_score": 60}
            ],
            "core_responsibilities": ["Build scalable APIs", "Develop responsive web interfaces"],
            "fallback_mode": True
        }
