import re
import math
import logging
from typing import List, Dict, Any
from .llm_client import get_llm_client_and_model, call_chat_completion, parse_json_safely

logger = logging.getLogger(__name__)


class IRTAdaptiveEngine:
    """
    Rasch 1PL (One-Parameter Logistic) Item Response Theory Engine.
    Estimates candidate latent ability (theta) dynamically after each response.
    
    IRT Parameter Space:
    - Candidate Ability (theta): [-3.0, +3.0], default 0.0 (Average Fresher)
    - Item Difficulty (b): [-2.5, +2.5]
    """

    INITIAL_THETA = 0.0          # Initial ability prior
    INITIAL_SEM = 1.0            # Initial Standard Error of Measurement
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
        delta_theta = cls.K_FACTOR * (actual_score - expected_p)
        new_theta = max(-3.0, min(3.0, current_theta + delta_theta))

        # Fisher Information: I(theta) = P * (1 - P)
        information = expected_p * (1.0 - expected_p)
        new_variance = 1.0 / ( (1.0 / (current_sem ** 2)) + information )
        new_sem = max(0.15, math.sqrt(new_variance))

        return round(new_theta, 3), round(new_sem, 3)

    @classmethod
    def theta_to_skill_iq(cls, theta: float) -> int:
        """
        Transforms latent theta [-3, +3] into a normalized Skill IQ scale [60, 160].
        Standard normal mean = 100, standard deviation = 15.
        """
        iq = 100 + (theta * 15.0)
        return int(max(60, min(160, round(iq))))

    @classmethod
    def select_next_difficulty(cls, current_theta: float) -> str:
        """
        Maximum Information Item Selection: Target items whose difficulty b matches theta.
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
        self.client, self.model = get_llm_client_and_model()
        self.irt = IRTAdaptiveEngine()

    def generate_adaptive_questions(self, gap_skills: List[str], initial_difficulty: str = 'intermediate', max_questions: int = 5) -> List[Dict[str, Any]]:
        """
        Generates initial calibrated questions for the gap skills with explicit IRT difficulty parameters.
        """
        if not gap_skills:
            gap_skills = ['JavaScript', 'Data Structures', 'REST APIs', 'PostgreSQL', 'Docker']

        skills_str = ", ".join(gap_skills[:max_questions])

        if not self.client or not self.model:
            logger.info(f"[DiagnosticEngine] LLM offline or unconfigured. Serving dynamic skill-matched question bank for: {gap_skills}")
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
    "skillTarget": "Exact skill name from: {skills_str}",
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
            logger.info(f"[DiagnosticEngine] Requesting LLM ({self.model}) to generate dynamic questions for gaps: {skills_str}")
            raw = call_chat_completion(self.client, self.model, system_prompt, user_prompt, temperature=0.2)
            parsed = parse_json_safely(raw)

            questions = None
            if isinstance(parsed, dict):
                for k in ['questions', 'data', 'items']:
                    if k in parsed and isinstance(parsed[k], list) and len(parsed[k]) > 0:
                        questions = parsed[k]
                        break
                if not questions:
                    for v in parsed.values():
                        if isinstance(v, list) and len(v) > 0:
                            questions = v
                            break
            elif isinstance(parsed, list) and len(parsed) > 0:
                questions = parsed

            if questions and len(questions) > 0:
                logger.info(f"[DiagnosticEngine] Successfully synthesized {len(questions)} dynamic questions via LLM.")
                return questions

            logger.warning("[DiagnosticEngine] LLM returned empty question list. Serving skill-matched question bank.")
            return self._get_fallback_irt_pool(gap_skills)
        except Exception as e:
            logger.warning(f"[DiagnosticEngine] LLM question generation call failed ({e}). Serving skill-matched question bank for: {gap_skills}")
            return self._get_fallback_irt_pool(gap_skills)

    def process_adaptive_session(self, base_match_score: float, responses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Executes step-by-step IRT trajectory across candidate answers to calculate final calibrated theta and Skill IQ.
        """
        theta = self.irt.INITIAL_THETA
        sem = self.irt.INITIAL_SEM
        trajectory = []
        skill_breakdown = {}

        for resp in responses:
            diff_b = resp.get('difficulty_b', 0.0)
            is_correct = resp.get('is_correct', False)
            skill = resp.get('skill', 'General')

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

            if skill not in skill_breakdown:
                skill_breakdown[skill] = {'attempts': 0, 'correct': 0}
            skill_breakdown[skill]['attempts'] += 1
            if is_correct:
                skill_breakdown[skill]['correct'] += 1

        skill_iq = self.irt.theta_to_skill_iq(theta)
        
        # Translate theta to placement readiness match boost (+0% to +20%)
        calibration_boost = round(((theta + 3.0) / 6.0) * 20.0, 1)
        final_calibrated_match = min(98.0, round(float(base_match_score) + calibration_boost, 1))

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
        """
        Dynamic IRT question repository tailored to the candidate's actual detected gap skills.
        Instead of returning static questions, it dynamically matches questions to the requested gap skills.
        """
        QUESTION_BANK: Dict[str, Dict[str, Any]] = {
            'redis': {
                "id": "q-redis-stampede",
                "category": "In-Memory Caching & Distributed Systems",
                "skillTarget": "Redis",
                "difficultyLevel": "intermediate",
                "difficulty_b": 0.0,
                "title": "Cache Stampede & Mutex Locking",
                "codeSnippet": "// Key expires under 50,000 req/sec concurrent traffic\nasync function getCachedProduct(productId) {\n  const cached = await redis.get(`product:${productId}`);\n  if (cached) return JSON.parse(cached);\n  // 10,000 requests hit DB simultaneously\n  const product = await db.query('SELECT * FROM products WHERE id = ?', [productId]);\n  await redis.setex(`product:${productId}`, 300, JSON.stringify(product));\n  return product;\n}",
                "question": "What is the primary architectural risk illustrated in this code snippet during high concurrent traffic spikes?",
                "options": [
                    {"id": "a", "text": "Cache Stampede (Thundering Herd) where simultaneous cache misses overwhelm the database with duplicate queries."},
                    {"id": "b", "text": "Redis memory overflow caused by storing JSON string serialization instead of hash sets."},
                    {"id": "c", "text": "Deadlock occurring inside Node.js event loop due to asynchronous Redis commands."},
                    {"id": "d", "text": "Database connection pool exhaustion caused by premature transaction rollbacks."}
                ],
                "correct": "a",
                "explanation": "When a hot cache key expires, thousands of concurrent requests find a cache miss and all query the database at once, causing a Cache Stampede. Solutions include distributed locks (Redlock) or probabilistic early expiration."
            },
            'docker': {
                "id": "q-docker-caching",
                "category": "Containerization & Image Optimization",
                "skillTarget": "Docker",
                "difficultyLevel": "intermediate",
                "difficulty_b": 0.0,
                "title": "Dockerfile Layer Caching Strategy",
                "codeSnippet": "# Snippet A:\nCOPY . .\nRUN npm install\n\n# Snippet B:\nCOPY package*.json ./\nRUN npm install\nCOPY . .",
                "question": "Why is Snippet B significantly faster across iterative CI/CD pipeline builds?",
                "options": [
                    {"id": "a", "text": "Docker reuses the cached 'npm install' layer when application source code changes, as long as package.json remains unmodified."},
                    {"id": "b", "text": "Snippet B automatically compresses the container layers into Alpine format."},
                    {"id": "c", "text": "Snippet B runs npm install across multiple CPU cores asynchronously."},
                    {"id": "d", "text": "Snippet A completely disables Docker's internal build cache."}
                ],
                "correct": "a",
                "explanation": "Docker invalidates cache layers from the first line that changes. Copying package.json separately ensures that code edits don't invalidate the expensive npm install build cache."
            },
            'postgresql': {
                "id": "q-sql-btree",
                "category": "Query Optimization & Indexing",
                "skillTarget": "PostgreSQL",
                "difficultyLevel": "advanced",
                "difficulty_b": 1.5,
                "title": "B-Tree Index Invalidation with Scalar Functions",
                "codeSnippet": "-- Table has standard B-Tree index on 'email'\nSELECT * FROM users WHERE LOWER(email) = 'alex@example.com';",
                "question": "Why does wrapping email in LOWER() cause PostgreSQL to fall back to a full sequential table scan?",
                "options": [
                    {"id": "a", "text": "Standard B-Tree indexes store raw column values; without a functional index on LOWER(email), the engine must compute the function per row."},
                    {"id": "b", "text": "PostgreSQL disables indexes automatically when WHERE clauses contain string operations."},
                    {"id": "c", "text": "B-Tree indexes cannot be used for WHERE equality filters."},
                    {"id": "d", "text": "The query locks the entire table in read-only mode."}
                ],
                "correct": "a",
                "explanation": "Functions on indexed columns prevent index lookups unless an expression index (e.g. CREATE INDEX ON users (LOWER(email))) exists."
            },
            'node': {
                "id": "q-node-eventloop",
                "category": "Runtime Concurrency & Event Loop",
                "skillTarget": "Node.js",
                "difficultyLevel": "intermediate",
                "difficulty_b": 0.0,
                "title": "Microtask vs Macrotask Execution Order",
                "codeSnippet": "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
                "question": "What is the exact execution output logged to the console in Node.js?",
                "options": [
                    {"id": "a", "text": "1 -> 4 -> 3 -> 2"},
                    {"id": "b", "text": "1 -> 2 -> 3 -> 4"},
                    {"id": "c", "text": "1 -> 4 -> 2 -> 3"},
                    {"id": "d", "text": "1 -> 3 -> 4 -> 2"}
                ],
                "correct": "a",
                "explanation": "Synchronous script execution logs 1 and 4. Microtasks (Promise.then) run immediately after current synchronous code (3), prior to next macrotask turn (setTimeout, 2)."
            },
            'react': {
                "id": "q-react-closure",
                "category": "Component Lifecycle & State Management",
                "skillTarget": "React.js",
                "difficultyLevel": "intermediate",
                "difficulty_b": 0.0,
                "title": "Stale Closure in useEffect Interval",
                "codeSnippet": "function Timer() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    const id = setInterval(() => {\n      setCount(count + 1);\n    }, 1000);\n    return () => clearInterval(id);\n  }, []);\n  return <h1>{count}</h1>;\n}",
                "question": "What will the Timer component display after 5 seconds, and why?",
                "options": [
                    {"id": "a", "text": "1, because the interval closure captures the initial count value (0) and continuously sets count to 0 + 1."},
                    {"id": "b", "text": "5, because React automatically updates closure references on state change."},
                    {"id": "c", "text": "0, because the interval never executes without count in the dependency array."},
                    {"id": "d", "text": "An infinite re-render runtime exception."}
                ],
                "correct": "a",
                "explanation": "The empty dependency array [] creates a stale closure capturing count as 0. To fix, use the updater form setCount(prev => prev + 1)."
            },
            'python': {
                "id": "q-python-gil",
                "category": "Language Internals & Multithreading",
                "skillTarget": "Python",
                "difficultyLevel": "intermediate",
                "difficulty_b": 0.0,
                "title": "GIL Impact on CPU-Bound Workloads",
                "codeSnippet": "from threading import Thread\n\ndef cpu_task():\n    count = 0\n    for _ in range(10_000_000): count += 1\n\nt1 = Thread(target=cpu_task)\nt2 = Thread(target=cpu_task)\nt1.start(); t2.start()\nt1.join(); t2.join()",
                "question": "Why does running two Python threads for CPU-bound tasks NOT achieve 2x multi-core speedup in CPython?",
                "options": [
                    {"id": "a", "text": "The Global Interpreter Lock (GIL) prevents multiple native OS threads from executing Python bytecodes concurrently."},
                    {"id": "b", "text": "Python threads are green threads simulated by the runtime without OS kernel scheduling."},
                    {"id": "c", "text": "CPU caches become thrashing because threading module disables L2 cache synchronization."},
                    {"id": "d", "text": "Integers in Python are immutable, causing memory bus locks."}
                ],
                "correct": "a",
                "explanation": "CPython's GIL permits only one thread to hold interpreter control at once. For CPU-bound parallel execution across multiple cores, multiprocessing or ProcessPoolExecutor must be used."
            },
            'rest': {
                "id": "q-rest-idempotence",
                "category": "HTTP Protocols & API Architecture",
                "skillTarget": "REST APIs",
                "difficultyLevel": "beginner",
                "difficulty_b": -1.5,
                "title": "HTTP Method Idempotency",
                "codeSnippet": "// Client retries network request after timeout\nPUT /api/users/42/profile HTTP/1.1\nPOST /api/orders HTTP/1.1",
                "question": "Why is PUT considered an idempotent HTTP method, whereas POST is not?",
                "options": [
                    {"id": "a", "text": "Making multiple identical PUT requests produces the exact same server resource state as a single request."},
                    {"id": "b", "text": "PUT requests are cached by browser clients, while POST requests cannot be cached."},
                    {"id": "c", "text": "PUT sends data in query parameters, while POST sends data in the HTTP request body."},
                    {"id": "d", "text": "PUT requests execute synchronously, while POST requests execute asynchronously."}
                ],
                "correct": "a",
                "explanation": "Idempotence means multiple identical requests have the exact same side-effect as a single request. PUT completely replaces the target resource, whereas duplicate POSTs create duplicate records."
            },
            'git': {
                "id": "q-git-rebase",
                "category": "Version Control & Branching Workflows",
                "skillTarget": "Git",
                "difficultyLevel": "intermediate",
                "difficulty_b": 0.0,
                "title": "Git Rebase vs Merge Commit History",
                "codeSnippet": "# Workflow A: git merge main\n# Workflow B: git rebase main",
                "question": "What is the critical behavioral difference of 'git rebase main' compared to 'git merge main'?",
                "options": [
                    {"id": "a", "text": "Rebase replays local commits on top of the target tip, creating a linear history and new commit SHAs."},
                    {"id": "b", "text": "Rebase automatically resolves conflicts without developer intervention."},
                    {"id": "c", "text": "Merge permanently rewrites commit timestamps, whereas rebase preserves original hashes."},
                    {"id": "d", "text": "Rebase creates a 3-way merge commit with two parent references."}
                ],
                "correct": "a",
                "explanation": "Git rebase rewrites project history by re-applying commits one by one on top of the specified base, generating new commit hashes and preserving a clean linear commit graph."
            },
            'dsa': {
                "id": "q-dsa-hashmap",
                "category": "Data Structures & Algorithmic Complexity",
                "skillTarget": "Data Structures & Algorithms",
                "difficultyLevel": "beginner",
                "difficulty_b": -1.5,
                "title": "Two-Sum Array Complement Optimization",
                "codeSnippet": "// Hash Map Single-Pass Lookup\nconst map = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const complement = target - nums[i];\n  if (map.has(complement)) return [map.get(complement), i];\n  map.set(nums[i], i);\n}",
                "question": "Why does the Hash Map single-pass lookup reduce time complexity from quadratic O(N²) to linear O(N)?",
                "options": [
                    {"id": "a", "text": "Hash Map provides average O(1) constant-time key lookups for the complement, eliminating the nested iteration loop."},
                    {"id": "b", "text": "Hash Map automatically sorts the array in O(log N) time prior to element traversal."},
                    {"id": "c", "text": "Hash Map executes array lookups asynchronously across multiple CPU worker threads."},
                    {"id": "d", "text": "Hash Map deletes visited duplicate elements to reduce the total number of iterations."}
                ],
                "correct": "a",
                "explanation": "Hash tables use hashing functions to achieve O(1) average lookup time. Replacing an inner O(N) linear search loop with an O(1) map lookup drops total complexity from O(N²) to O(N)."
            },
        }

        matched_questions: List[Dict[str, Any]] = []
        normalized_gaps = [g.lower().strip() for g in gap_skills]

        # 1. Match questions specifically for the detected gap skills
        for gap_skill in normalized_gaps:
            for bank_key, q_data in QUESTION_BANK.items():
                if bank_key in gap_skill or gap_skill in bank_key:
                    if q_data not in matched_questions:
                        matched_questions.append(q_data)
                        break

        # 2. Fill remainder up to 5 questions if needed
        if len(matched_questions) < 5:
            for q_data in QUESTION_BANK.values():
                if q_data not in matched_questions:
                    matched_questions.append(q_data)
                if len(matched_questions) >= 5:
                    break

        return matched_questions[:5]
