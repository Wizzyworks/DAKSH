import re
from typing import List, Dict, Any


class PersonalizedRankingEngine:
    """
    Multi-Factor Content Ranking Algorithm:
    Ranks discovered video and documentation materials based on:
      1. Semantic Topic Match (35%)
      2. User Ability Fit theta (35%) -> Novice vs Expert personalization
      3. Channel Authority & Engineering Depth (20%)
      4. Recency & Completeness (10%)
    """

    AUTHORITATIVE_KEYWORDS = [
        'deep dive', 'internals', 'architecture', 'optimization', 'performance',
        'masterclass', 'system design', 'indexing', 'advanced', 'crash course'
    ]

    NOVICE_KEYWORDS = [
        'beginner', 'fundamentals', 'introduction', 'basics', 'step by step',
        'tutorial for beginners', '101', 'start here'
    ]

    @classmethod
    def rank_and_select_best_resources(
        cls,
        discovered_items: List[Dict[str, Any]],
        topic: str,
        user_theta: float = 0.0,
        gap_severity: str = 'High',
        top_k: int = 2
    ) -> List[Dict[str, Any]]:
        """
        Ranks live discovered resources and returns the top_k best-fit materials for this user.
        """
        if not discovered_items:
            return []

        scored_items = []
        topic_words = set(re.findall(r'\w+', topic.lower()))

        for item in discovered_items:
            title_lower = item.get('title', '').lower()
            desc_lower = item.get('description', '').lower()
            combined_text = f"{title_lower} {desc_lower}"

            # 1. Semantic Match Score (0 - 35)
            matched_words = sum(1 for w in topic_words if w in combined_text)
            semantic_score = min(35.0, (matched_words / max(1, len(topic_words))) * 35.0)

            # 2. Ability Fit Score (0 - 35) based on Candidate theta
            ability_score = 20.0
            if user_theta >= 0.5:
                # Advanced user: Award bonus for deep dive / architecture terms
                auth_matches = sum(1 for k in cls.AUTHORITATIVE_KEYWORDS if k in combined_text)
                ability_score = min(35.0, 15.0 + (auth_matches * 5.0))
            elif user_theta <= -0.5:
                # Novice user: Award bonus for fundamentals / clear beginner breakdown
                novice_matches = sum(1 for k in cls.NOVICE_KEYWORDS if k in combined_text)
                ability_score = min(35.0, 15.0 + (novice_matches * 5.0))
            else:
                # Intermediate user: Balanced weight
                ability_score = 28.0

            # 3. Authority & Channel Factor (0 - 20)
            authority_score = 15.0
            if any(k in combined_text for k in ['official', 'foundation', 'mit', 'stanford', 'freecodecamp', 'deep dive']):
                authority_score = 20.0

            # 4. Severity Urgency Factor (0 - 10)
            severity_bonus = 10.0 if gap_severity in ['Critical', 'High'] else 6.0

            total_score = round(semantic_score + ability_score + authority_score + severity_bonus, 2)

            scored_items.append({
                **item,
                'ranking_score': total_score,
                'difficulty_tier': 'Advanced Deep-Dive' if user_theta >= 0.5 else ('Beginner Fast-Track' if user_theta <= -0.5 else 'Intermediate Core')
            })

        # Sort descending by ranking score
        scored_items.sort(key=lambda x: x['ranking_score'], reverse=True)
        return scored_items[:top_k]
