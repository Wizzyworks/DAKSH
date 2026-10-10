import json
import re
import math
import os
from typing import List, Dict, Any, Optional
from django.conf import settings
from groq import Groq


class IRTAdaptiveEngine:
    """
    Item Response Theory (IRT) 1PL Rasch Model & Adaptive Calibration Algorithm.
    Calibrates candidate ability (theta) on a standard normal logistic scale [-3.0, +3.0]
    and translates it to a 0–300 Pluralsight-style Skill IQ score.
    """

    # Scale constants
    INITIAL_THETA = 0.0          # Initial candidate ability (Intermediate / Mean = 0.0)
    INITIAL_SEM = 1.0            # Standard Error of Measurement
    K_FACTOR = 0.8               # Ability adjustment step size

    DIFFICULTY_MAPPING = {
        'beginner': -1.5,
        'intermediate': 0.0,
        'advanced': 1.5,
        'expert': 2.5
    }

    @classmethod
    def probability_of_correct_answer(cls, theta: float, difficulty_b: float) -> float:
        """
        Rasch 1PL Logistic Model:
        P(correct | theta, b) = 1 / (1 + exp(-(theta - b)))
        """
        exponent = -(theta - difficulty_b)
        # Prevent floating point overflow
        exponent = max(-20.0, min(20.0, exponent))
        return 1.0 / (1.0 + math.exp(exponent))

    @classmethod
    def update_ability_estimate(cls, current_theta: float, current_sem: float,
                                difficulty_b: float, is_correct: bool) -> tuple[float, float]:
        """
        Updates candidate ability (theta) and shrinks Standard Error of Measurement (SEM)
        using Bayesian/MML adaptive adjustment.
        """
        actual_score = 1.0 if is_correct else 0.0
        expected_p = cls.probability_of_correct_answer(current_theta, difficulty_b)

        # Update ability (theta)
        delta = cls.K_FACTOR * current_sem * (actual_score - expected_p)
        new_theta = max(-3.0, min(3.0, current_theta + delta))

        # Update Fisher Information: I(theta) = P * (1 - P)
        fisher_info = expected_p * (1.0 - expected_p)
        new_sem = math.sqrt(max(0.04, (current_sem ** 2) / (1.0 + (current_sem ** 2) * fisher_info)))

        return round(new_theta, 3), round(new_sem, 3)

    @classmethod
    def theta_to_skill_iq(cls, theta: float) -> int:
        """
        Maps ability theta [-3.0, +3.0] to Pluralsight-style Skill IQ [0 - 300].
        theta = 0.0 -> 150 (Proficient)
        theta = +2.0 -> 250 (Expert)
        theta = -2.0 -> 50 (Novice)
        """
        iq = int(150 + (theta * 50))
        return max(0, min(300, iq))

    @classmethod
    def select_next_difficulty(cls, current_theta: float) -> str:
        """
        Selects the optimal question difficulty for maximum test information at current theta.
        """
        if current_theta < -0.75:
            return 'beginner'
        elif current_theta < 0.75:
            return 'intermediate'
        elif current_theta < 1.75:
            return 'advanced'
        else:
            return 'expert'


class DiagnosticEngineService:
    """
    Full IRT-powered Adaptive Diagnostic Arena Service.
    """

    def __init__(self):
        self.api_key = getattr(settings, 'GROQ_API_KEY', os.getenv('GROQ_API_KEY', ''))
        self.model = getattr(settings, 'GROQ_MODEL', os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile'))
        self.client = Groq(api_key=self.api_key) if self.api_key else None
        self.irt = IRTAdaptiveEngine()

    def generate_adaptive_questions(self, gap_skills: List[str], initial_difficulty: str = 'intermediate', max_questions: int = 5) -> List[Dict[str, Any]]:
        """
        Generates initial calibrated questions for the gap skills with explicit IRT difficulty parameters.
        """
        if not gap_skills:
            gap_skills = ['JavaScript', 'Data Structures', 'REST APIs', 'PostgreSQL', 'Docker']

        skills_str = ", ".join(gap_skills[:max_questions])

        if not self.client or not self.api_key:
            return self._get_fallback_irt_pool(gap_skills)

        system_prompt = (
            "You are a Principal Software Architect and Psychometric Assessment Engineer. "
            "Generate adaptive diagnostic questions with code snippets for technical skill gap evaluation. "
            "Assign precise IRT difficulty parameters: 'beginner' (-1.5), 'intermediate' (0.0), 'advanced' (+1.5)."
        )

        user_prompt = f"""
Generate {min(len(gap_skills), max_questions)} technical diagnostic questions covering these skills: {skills_str}.
Initial target difficulty: {initial_difficulty}.

Return ONLY a JSON array matching this exact schema:
[
  {{
    "id": "q-unique-slug",
    "category": "e.g. Asynchronous Concurrency / Database Query Optimization",
    "skillTarget": "Exact skill name",
    "difficultyLevel": "{initial_difficulty}",
    "difficulty_b": {self.irt.DIFFICULTY_MAPPING.get(initial_difficulty, 0.0)},
    "title": "Scenario Title (e.g. Event Loop Execution Order)",
    "codeSnippet": "clean code snippet (or null if purely architectural)",
    "question": "Deep technical question testing true understanding, not superficial recall",
    "options": [
      {{ "id": "a", "text": "Option A" }},
      {{ "id": "b", "text": "Option B" }},
      {{ "id": "c", "text": "Option C" }},
      {{ "id": "d", "text": "Option D" }}
    ],
    "correct": "a" | "b" | "c" | "d",
    "explanation": "In-depth rationale citing core engineering principles."
  }}
]
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            raw = response.choices[0].message.content
            cleaned = re.sub(r'^```json\s*', '', raw.strip(), flags=re.MULTILINE)
            cleaned = re.sub(r'\s*```$', '', cleaned.strip(), flags=re.MULTILINE)
            parsed = json.loads(cleaned)

            if isinstance(parsed, dict):
                for k in ['questions', 'data', 'items']:
                    if k in parsed and isinstance(parsed[k], list):
                        return parsed[k]
                for v in parsed.values():
                    if isinstance(v, list):
                        return v
            elif isinstance(parsed, list):
                return parsed

            return self._get_fallback_irt_pool(gap_skills)
        except Exception:
            return self._get_fallback_irt_pool(gap_skills)

    def process_adaptive_session(self, base_match_score: float, responses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executes step-by-step IRT trajectory across candidate answers to calculate final calibrated theta and Skill IQ.
        
        responses format:
        [
          {"question_id": "q1", "skill": "Node.js", "difficulty_b": 0.0, "is_correct": True},
          {"question_id": "q2", "skill": "PostgreSQL", "difficulty_b": 1.5, "is_correct": False},
          ...
        ]
        """
        theta = self.irt.INITIAL_THETA
        sem = self.irt.INITIAL_SEM
        trajectory = []
        skill_breakdown = {}

        for resp in responses:
            diff_b = resp.get('difficulty_b', 0.0)
            is_correct = resp.get('is_correct', False)
            skill = resp.get('skill', 'General')

            # Compute IRT expected probability before update
            expected_p = self.irt.probability_of_correct_answer(theta, diff_b)
            theta, sem = self.irt.update_ability_estimate(theta, sem, diff_b, is_correct)

            trajectory.append({
                'skill': skill,
                'difficulty_b': diff_b,
                'is_correct': is_correct,
                'expected_prob': round(expected_p, 3),
                'updated_theta': theta,
                'updated_sem': sem
            })

            # Track per-skill outcome
            if skill not in skill_breakdown:
                skill_breakdown[skill] = {'attempts': 0, 'correct': 0}
            skill_breakdown[skill]['attempts'] += 1
            if is_correct:
                skill_breakdown[skill]['correct'] += 1

        skill_iq = self.irt.theta_to_skill_iq(theta)
        
        # Translate theta to placement readiness match boost (+0% to +20%)
        # theta = -3.0 -> 0% boost, theta = 0.0 -> +10%, theta = +3.0 -> +20%
        calibration_boost = round(((theta + 3.0) / 6.0) * 20.0, 1)
        final_calibrated_match = min(98.0, round(float(base_match_score) + calibration_boost, 1))

        # Categorize confirmed gaps for Phase 2 Learning Hub
        confirmed_gaps = [s for s, stats in skill_breakdown.items() if stats['correct'] == 0]
        verified_strengths = [s for s, stats in skill_breakdown.items() if stats['correct'] > 0]

        return {
            'base_match_score': float(base_match_score),
            'final_calibrated_match': final_calibrated_match,
            'irt_theta': theta,
            'irt_sem': sem,
            'skill_iq_score': skill_iq,
            'proficiency_tier': 'Expert' if theta >= 1.5 else ('Proficient' if theta >= -0.5 else 'Novice'),
            'calibration_boost': calibration_boost,
            'responses_count': len(responses),
            'confirmed_gaps': confirmed_gaps,
            'verified_strengths': verified_strengths,
            'irt_trajectory': trajectory
        }

    def _get_fallback_irt_pool(self, gap_skills: List[str]) -> List[Dict[str, Any]]:
        """Fallback question pool with calibrated IRT difficulty parameters."""
        return [
            {
                "id": "q-node-eventloop",
                "category": "Runtime Concurrency & Event Loop",
                "skillTarget": "Node.js",
                "difficultyLevel": "intermediate",
                "difficulty_b": 0.0,
                "title": "Microtask vs Macrotask Execution Order",
                "codeSnippet": "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
                "question": "What is the exact execution output logged to the console?",
                "options": [
                    {"id": "a", "text": "1 -> 4 -> 3 -> 2"},
                    {"id": "b", "text": "1 -> 2 -> 3 -> 4"},
                    {"id": "c", "text": "1 -> 4 -> 2 -> 3"},
                    {"id": "d", "text": "1 -> 3 -> 4 -> 2"}
                ],
                "correct": "a",
                "explanation": "Synchronous calls (1, 4) execute first on the main stack. Then microtasks (Promise.then) execute (3) before timer macrotasks (setTimeout) in the event loop (2)."
            },
            {
                "id": "q-sql-btree",
                "category": "Query Optimization & Indexing",
                "skillTarget": "PostgreSQL",
                "difficultyLevel": "advanced",
                "difficulty_b": 1.5,
                "title": "B-Tree Index Invalidation with Scalar Functions",
                "codeSnippet": "-- Schema has standard B-Tree index on 'email'\nSELECT * FROM users WHERE LOWER(email) = 'alex@example.com';",
                "question": "Why does wrapping email in LOWER() cause PostgreSQL to fall back to a sequential table scan?",
                "options": [
                    {"id": "a", "text": "Standard B-Tree indexes store raw column values, preventing lookup when an expression wraps the column without a functional index."},
                    {"id": "b", "text": "PostgreSQL disables indexes automatically when WHERE clauses contain string operations."},
                    {"id": "c", "text": "B-Tree indexes cannot be used for WHERE equality filters."},
                    {"id": "d", "text": "The query locks the entire table in read-only mode."}
                ],
                "correct": "a",
                "explanation": "Functions like LOWER() transform values at runtime. Without an expression index (LOWER(email)), the database engine must compute the function for every row via a full table scan."
            },
            {
                "id": "q-docker-caching",
                "category": "Containerization & Image Optimization",
                "skillTarget": "Docker",
                "difficultyLevel": "intermediate",
                "difficulty_b": 0.0,
                "title": "Dockerfile Layer Caching Strategy",
                "codeSnippet": "# Snippet A:\nCOPY . .\nRUN npm install\n\n# Snippet B:\nCOPY package*.json ./\nRUN npm install\nCOPY . .",
                "question": "Why is Snippet B significantly faster across iterative builds?",
                "options": [
                    {"id": "a", "text": "Docker reuses the cached 'npm install' layer when source code changes, as long as package.json is unmodified."},
                    {"id": "b", "text": "Snippet B automatically compresses the container layers."},
                    {"id": "c", "text": "Snippet B runs npm install across multiple CPU cores."},
                    {"id": "d", "text": "Snippet A disables npm cache."}
                ],
                "correct": "a",
                "explanation": "Docker invalidates build cache from the first changed line. By copying package.json first, application code edits won't bust the expensive npm install cache layer."
            }
        ]
