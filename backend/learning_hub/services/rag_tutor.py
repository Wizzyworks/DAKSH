import os
from typing import Dict, Any, Optional
from django.conf import settings
from groq import Groq


class SetuAITutorService:
    """
    Context-Aware Socratic AI Tutor (SETU AI).
    Ingests the active stage course metadata, video summary, documentation links,
    and user performance context to answer learner questions.
    """

    def __init__(self):
        self.api_key = getattr(settings, 'GROQ_API_KEY', os.getenv('GROQ_API_KEY', ''))
        self.model = getattr(settings, 'GROQ_MODEL', os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile'))
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    def answer_in_context(
        self,
        user_query: str,
        stage_title: str,
        skill_name: str,
        course_metadata: Optional[Dict[str, Any]] = None,
        failed_question_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Answers a student's query with full awareness of what they are studying.
        """
        if not self.client or not self.api_key:
            return {
                'answer': f"SETU AI: You are studying {skill_name} ({stage_title}). To master this, focus on core architectural trade-offs and practice implementing hands-on examples.",
                'context_used': {'stage': stage_title, 'skill': skill_name}
            }

        # Build Context Prompt
        course_info = course_metadata or {}
        context_block = f"""
Current Learning Stage: '{stage_title}'
Target Technology/Concept: '{skill_name}'
Course Material Provider: '{course_info.get('provider', 'DAKSH Learning')}'
Documentation Reference: '{course_info.get('pdf_material_url', 'Official Documentation')}'
"""

        if failed_question_context:
            context_block += f"""
Recent Quiz Struggle:
- Question: {failed_question_context.get('question')}
- Student chose: {failed_question_context.get('user_choice')} (INCORRECT)
- Correct Answer: {failed_question_context.get('correct_choice')}
- Root Concept Explanation: {failed_question_context.get('explanation')}
"""

        system_prompt = (
            "You are SETU AI, an empathetic, top-tier engineering mentor and Socratic tutor. "
            "Help the student master technical software concepts. "
            "Be clear, concise, use practical code examples where helpful, and explain the 'why' behind the engineering decisions."
        )

        user_prompt = f"""
LEARNING CONTEXT:
{context_block}

STUDENT'S QUESTION:
"{user_query}"

Provide an insightful, conversational explanation tailored to their current learning context.
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=600
            )
            answer_text = response.choices[0].message.content
            return {
                'answer': answer_text,
                'context_used': {
                    'stage': stage_title,
                    'skill': skill_name,
                    'has_quiz_context': bool(failed_question_context)
                }
            }
        except Exception as e:
            return {
                'answer': f"SETU AI Tutor: In {skill_name}, key concepts involve understanding execution flow, resource management, and state guarantees.",
                'error': str(e)
            }
