// Dynamic Adaptive Question Pool for Fresher Placement Calibration (No Difficulty Labels)

export const PRESET_ROLES = [
  {
    id: 'sde-fullstack',
    title: 'Full Stack Engineer (SDE-1)',
    tier: 'Product Unicorn / High Growth',
    coreSkills: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'Git'],
    description: 'Build responsive web apps with performant client UI and scalable RESTful backend services.',
  },
  {
    id: 'sde-frontend',
    title: 'Frontend Engineer (React/Next.js)',
    tier: 'Tier-1 Tech / Product Companies',
    coreSkills: ['React.js', 'TypeScript', 'Next.js', 'TailwindCSS', 'Redux/Zustand', 'Web Performance', 'Jest'],
    description: 'Craft responsive, accessible user interfaces with clean state management and animations.',
  },
  {
    id: 'sde-backend',
    title: 'Backend Engineer (Node/Python/Go)',
    tier: 'Tier-1 SDE / Distributed Systems',
    coreSkills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'SQL Indexing', 'System Design'],
    description: 'Design robust APIs, caching layers, database schemas, and microservice communication.',
  },
  {
    id: 'sde-aiml',
    title: 'AI / ML Engineer (GenAI & Python)',
    tier: 'AI Labs & Innovation Teams',
    coreSkills: ['Python', 'PyTorch', 'HuggingFace', 'FastAPI', 'Vector Databases', 'LangChain', 'Data Structures'],
    description: 'Build RAG pipelines, fine-tune open-weights models, and deploy scalable inference microservices.',
  },
]

// Adaptive Assessment Question Pool (Multi-Format: DSA, Code Debugging, Output Prediction, Protocol, Database)
export const ADAPTIVE_QUESTION_POOL = [
  {
    id: 'q-dsa-hashmap',
    category: 'Data Structures & Algorithmic Complexity',
    skillTarget: 'DSA & Core CS',
    title: 'Two-Sum Array Complement Optimization',
    codeSnippet: `// Approach A: Brute Force Nested Iteration
for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    if (nums[i] + nums[j] === target) return [i, j];
  }
}

// Approach B: Hash Map Single-Pass Lookup
const map = new Map();
for (let i = 0; i < nums.length; i++) {
  const complement = target - nums[i];
  if (map.has(complement)) return [map.get(complement), i];
  map.set(nums[i], i);
}`,
    question:
      'Why does the Hash Map single-pass lookup reduce time complexity from quadratic O(N²) to linear O(N)?',
    options: [
      {
        id: 'a',
        text: 'Hash Map provides average O(1) constant-time key lookups for the complement, eliminating the inner loop.',
      },
      {
        id: 'b',
        text: 'Hash Map automatically sorts the array in O(log N) time prior to element traversal.',
      },
      {
        id: 'c',
        text: 'Hash Map executes array lookups asynchronously across multiple CPU worker threads.',
      },
      {
        id: 'd',
        text: 'Hash Map deletes visited duplicate elements to reduce the total number of iterations.',
      },
    ],
    correct: 'a',
    explanation:
      'Hash Map stores previously visited numbers with their indices, allowing complement lookups in average O(1) time without nested iterations.',
  },
  {
    id: 'q-react-debug',
    category: 'Component State Lifecycle & Side Effects',
    skillTarget: 'React.js',
    title: 'React useEffect Stale Prop Bug',
    codeSnippet: `function UserProfileCard({ userId }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserProfile(userId).then((res) => {
      setUserData(res.data);
    });
  }, []); // <-- Notice the dependency array

  return <div>{userData ? userData.name : 'Loading...'}</div>;
}`,
    question:
      'When the parent component updates userId from 101 to 102, what unexpected behavior occurs in the component above?',
    options: [
      {
        id: 'a',
        text: 'The component enters an infinite re-render loop crashing the browser window.',
      },
      {
        id: 'b',
        text: 'The component fails to fetch the updated profile for userId 102 because userId is omitted from the dependency array.',
      },
      {
        id: 'c',
        text: 'React throws a fatal TypeError because fetchUserProfile cannot run inside useEffect.',
      },
      {
        id: 'd',
        text: 'The userData state resets to null on every single render cycle.',
      },
    ],
    correct: 'b',
    explanation:
      'With an empty dependency array [], the effect executes only once on initial mount. Adding [userId] ensures the effect re-runs whenever the prop updates.',
  },
  {
    id: 'q-js-eventloop',
    category: 'JavaScript Runtime & Concurrency Model',
    skillTarget: 'JavaScript (ES6+)',
    title: 'Asynchronous Event Loop Execution Order',
    codeSnippet: `console.log('Step 1');

setTimeout(() => {
  console.log('Step 2');
}, 0);

Promise.resolve().then(() => {
  console.log('Step 3');
});

console.log('Step 4');`,
    question: 'What is the exact execution output logged to the console?',
    options: [
      { id: 'a', text: 'Step 1 -> Step 4 -> Step 3 -> Step 2' },
      { id: 'b', text: 'Step 1 -> Step 2 -> Step 3 -> Step 4' },
      { id: 'c', text: 'Step 1 -> Step 3 -> Step 4 -> Step 2' },
      { id: 'd', text: 'Step 1 -> Step 4 -> Step 2 -> Step 3' },
    ],
    correct: 'a',
    explanation:
      'Synchronous logs (Step 1, Step 4) run on the main call stack first. Then microtasks (Promise.then) execute (Step 3) before macrotasks (setTimeout) in the task queue (Step 2).',
  },
  {
    id: 'q-api-status',
    category: 'REST API Protocols & Error Handling',
    skillTarget: 'REST APIs & Backend',
    title: 'Authentication Protocol Conventions',
    codeSnippet: `// Backend Protected Middleware
function requireAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || isTokenExpired(token)) {
    // Missing or invalid authorization token
    return res.status(???).json({ error: 'Authentication required' });
  }
  next();
}`,
    question:
      'What standard HTTP status code should the middleware return when the authorization token is missing or expired?',
    options: [
      { id: 'a', text: '401 Unauthorized (Client must authenticate before accessing resource)' },
      { id: 'b', text: '403 Forbidden (Authenticated, but lacking required admin permissions)' },
      { id: 'c', text: '404 Not Found (Requested route or resource does not exist)' },
      { id: 'd', text: '500 Internal Server Error (Unexpected crash in server logic)' },
    ],
    correct: 'a',
    explanation:
      'HTTP 401 Unauthorized is the standard response for missing or invalid authentication credentials, whereas 403 Forbidden indicates the identity is known but not permitted.',
  },
  {
    id: 'q-sql-indexing',
    category: 'Database Query Optimization & Indexing',
    skillTarget: 'PostgreSQL & SQL',
    title: 'B-Tree Indexing on Filter Queries',
    codeSnippet: `-- Schema has B-Tree index on column: "email"
-- Query A:
SELECT * FROM users WHERE email = 'alex@example.com';

-- Query B:
SELECT * FROM users WHERE LOWER(email) = 'alex@example.com';`,
    question:
      'Why does Query B trigger a slow sequential table scan instead of using the standard index on email?',
    options: [
      {
        id: 'a',
        text: 'Applying the function LOWER(email) prevents the query planner from using the standard B-Tree index without a functional index.',
      },
      {
        id: 'b',
        text: 'PostgreSQL disables all indexes automatically when WHERE clauses contain string comparisons.',
      },
      {
        id: 'c',
        text: 'Query B locks the entire table into read-only mode during uppercase conversions.',
      },
      {
        id: 'd',
        text: 'B-Tree indexes only support integer primary key columns, not text columns.',
      },
    ],
    correct: 'a',
    explanation:
      'Standard B-Tree indexes store raw values. When a function like LOWER() wraps a column in the WHERE clause, the database must evaluate every row sequentially unless an expression index (LOWER(email)) exists.',
  },
]
