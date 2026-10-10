const API_BASE_URL = 'http://localhost:8000/api/skill-gap'

export const skillGapApi = {
  // 1. Fetch Preset Target Roles
  async getRoles() {
    try {
      const res = await fetch(`${API_BASE_URL}/roles/`)
      if (!res.ok) throw new Error('Failed to fetch roles')
      return await res.json()
    } catch (err) {
      console.warn('Using fallback roles:', err)
      return null
    }
  },

  // 2. Parse Resume (PDF/DOCX file or raw text)
  async parseResume(file, rawText = '') {
    const formData = new FormData()
    if (file) {
      formData.append('resume', file)
    }
    if (rawText) {
      formData.append('raw_text', rawText)
    }

    const res = await fetch(`${API_BASE_URL}/parse-resume/`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Failed to parse resume')
    return await res.json()
  },

  // 3. Analyze Benchmark & Compute Semantic Gaps
  async analyzeBenchmark(roleSlug, candidateSkills, customJDText = '') {
    const res = await fetch(`${API_BASE_URL}/analyze-benchmark/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role_slug: roleSlug,
        candidate_skills: candidateSkills,
        custom_jd_text: customJDText,
      }),
    })
    if (!res.ok) throw new Error('Failed to analyze benchmark')
    return await res.json()
  },

  // 4. Generate IRT Dynamic Diagnostic Questions for Detected Gaps
  async generateDiagnosticQuestions(gapSkills, difficulty = 'intermediate') {
    const res = await fetch(`${API_BASE_URL}/generate-diagnostic/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gap_skills: gapSkills,
        difficulty,
        max_questions: 5,
      }),
    })
    if (!res.ok) throw new Error('Failed to generate diagnostic questions')
    return await res.json()
  },

  // 5. Calibrate Candidate Score via IRT 1PL Rasch Model
  async calibrateDiagnostic(baseMatchScore, responses) {
    const res = await fetch(`${API_BASE_URL}/calibrate-diagnostic/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_match_score: baseMatchScore,
        responses,
      }),
    })
    if (!res.ok) throw new Error('Failed to calibrate diagnostic')
    return await res.json()
  },
}
