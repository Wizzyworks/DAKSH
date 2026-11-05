import { API_ENDPOINTS, fetchApi, getAuthHeaders } from './apiConfig'

export const skillGapApi = {
  // 1. Fetch Preset Target Roles from backend
  async getRoles() {
    try {
      const res = await fetchApi(API_ENDPOINTS.skillGap.roles, {
        method: 'GET',
      })
      return res
    } catch (err) {
      console.warn('Backend roles unavailable, using fallback preset roles:', err.message)
      return null
    }
  },

  // 2. Parse Resume (PDF/DOCX file or raw text) via backend
  async parseResume(file, rawText = '') {
    const formData = new FormData()
    if (file) {
      formData.append('resume', file)
    }
    if (rawText) {
      formData.append('raw_text', rawText)
    }

    return await fetchApi(API_ENDPOINTS.skillGap.parseResume, {
      method: 'POST',
      body: formData,
    })
  },

  // 3. Analyze Benchmark & Compute Semantic Gaps via backend
  async analyzeBenchmark(roleSlug, candidateSkills, customJDText = '') {
    return await fetchApi(API_ENDPOINTS.skillGap.analyzeBenchmark, {
      method: 'POST',
      body: JSON.stringify({
        role_slug: roleSlug,
        candidate_skills: candidateSkills,
        custom_jd_text: customJDText,
      }),
    })
  },

  // 4. Generate IRT Dynamic Diagnostic Questions for Detected Gaps via backend
  async generateDiagnosticQuestions(gapSkills, difficulty = 'intermediate') {
    return await fetchApi(API_ENDPOINTS.skillGap.generateDiagnostic, {
      method: 'POST',
      body: JSON.stringify({
        gap_skills: gapSkills,
        difficulty,
        max_questions: 5,
      }),
    })
  },

  // 5. Calibrate Candidate Score via IRT 1PL Rasch Model via backend
  async calibrateDiagnostic(baseMatchScore, responses) {
    return await fetchApi(API_ENDPOINTS.skillGap.calibrateDiagnostic, {
      method: 'POST',
      body: JSON.stringify({
        base_match_score: baseMatchScore,
        responses,
      }),
    })
  },
}
