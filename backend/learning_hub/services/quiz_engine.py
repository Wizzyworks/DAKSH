import json
import re
import os
from typing import List, Dict, Any
from django.conf import settings
from groq import Groq


class StageQuizEngineService:
    """
    Generates dynamic stage assessment quizzes and evaluates learner submissions.
    """

    def __init__(self):
        self.api_key = getattr(settings, 'GROQ_API_KEY', os.getenv('GROQ_API_KEY', ''))
        self.model = getattr(settings, 'GROQ_MODEL', os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile'))
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    def generate_stage_quiz(self, stage_title: str, skill_name: str, num_questions: int = 3) -> List[Dict[str, Any]]:
        """
        Generates dynamic MCQs tailored to the completed learning module.
        """
        if not self.client or not self.api_key:
            return self._fallback_quiz(skill_name)

        system_prompt = (
            "You are a Senior Technical Instructor and Examination Architect. "
            "Create challenging, practical technical MCQs with code snippets testing real understanding."
        )

        user_prompt = f"""
Generate {num_questions} technical verification questions for the topic: '{skill_name}' (Stage: '{stage_title}').

Return ONLY a valid JSON array matching this exact schema:
[
  {{
    "id": "q1",
    "question": "Clear technical scenario question",
    "codeSnippet": "clean code snippet or null",
    "options": [
      {{ "id": "a", "text": "Option text A" }},
      {{ "id": "b", "text": "Option text B" }},
      {{ "id": "c", "text": "Option text C" }},
      {{ "id": "d", "text": "Option text D" }}
    ],
    "correct": "a" | "b" | "c" | "d",
    "explanation": "Clear explanation of the correct answer and why other options are invalid."
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

            return self._fallback_quiz(skill_name)
        except Exception:
            return self._fallback_quiz(skill_name)

    @staticmethod
    def evaluate_submission(questions: List[Dict[str, Any]], user_answers: Dict[str, str]) -> Dict[str, Any]:
        """
        Evaluates user answers against answer keys and computes pass/fail status (Pass >= 66%).
        """
        total = len(questions)
        correct_count = 0
        feedback = []

        for q in questions:
            q_id = str(q.get('id', ''))
            user_choice = user_answers.get(q_id, '').lower()
            correct_choice = str(q.get('correct', '')).lower()
            is_correct = (user_choice == correct_choice)

            if is_correct:
                correct_count += 1

            feedback.append({
                'question_id': q_id,
                'question': q.get('question', ''),
                'user_choice': user_choice,
                'correct_choice': correct_choice,
                'is_correct': is_correct,
                'explanation': q.get('explanation', '')
            })

        score_percent = round((correct_count / max(1, total)) * 100.0, 1)
        passed = score_percent >= 66.0

        return {
            'total_questions': total,
            'correct_count': correct_count,
            'score_percent': score_percent,
            'passed': passed,
            'xp_earned': 180 if passed else 40,
            'feedback': feedback
        }

    @staticmethod
    def _fallback_quiz(skill_name: str) -> List[Dict[str, Any]]:
        return [
            {
                "id": "q1",
                "question": f"What is the primary architectural advantage of using {skill_name} in production systems?",
                "codeSnippet": None,
                "options": [
                    {"id": "a", "text": "Provides deterministic scalability, efficiency, and robust data handling."},
                    {"id": "b", "text": "Eliminates all network latency automatically."},
                    {"id": "c", "text": "Replaces the underlying operating system kernel."},
                    {"id": "d", "text": "Disables database transaction logging."}
                ],
                "correct": "a",
                "explanation": f"{skill_name} enables modular, scalable, and resilient engineering architectures."
            }
        ]
