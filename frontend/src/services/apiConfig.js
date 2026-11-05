/**
 * Centralized API & Backend URL Configuration
 *
 * Reads backend API endpoints from Vite environment variables (.env in frontend directory):
 * - VITE_API_BASE_URL (or VITE_API_URL): Root for Django REST endpoints (e.g. http://localhost:8000/api)
 * - VITE_BACKEND_URL: Root for Django media & static file assets (e.g. http://localhost:8000)
 */

const rawApiUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api'

const rawBackendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:8000'

// Normalize paths by stripping trailing slashes
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '')
export const BACKEND_URL = rawBackendUrl.replace(/\/+$/, '')

// Sub-service roots
export const AUTH_API_URL = `${API_BASE_URL}/auth`
export const SKILL_GAP_API_URL = `${API_BASE_URL}/skill-gap`

// Explicit route endpoints
export const API_ENDPOINTS = {
  auth: {
    register: `${AUTH_API_URL}/register/`,
    login: `${AUTH_API_URL}/login/`,
    logout: `${AUTH_API_URL}/logout/`,
    me: `${AUTH_API_URL}/me/`,
    profile: `${AUTH_API_URL}/profile/`,
    onboarding: `${AUTH_API_URL}/onboarding/`,
    onboardingStatus: `${AUTH_API_URL}/onboarding/status/`,
    skills: `${AUTH_API_URL}/skills/`,
    refreshToken: `${AUTH_API_URL}/token/refresh/`,
    verifyToken: `${AUTH_API_URL}/token/verify/`,
    changePassword: `${AUTH_API_URL}/change-password/`,
  },
  skillGap: {
    roles: `${SKILL_GAP_API_URL}/roles/`,
    parseResume: `${SKILL_GAP_API_URL}/parse-resume/`,
    analyzeBenchmark: `${SKILL_GAP_API_URL}/analyze-benchmark/`,
    generateDiagnostic: `${SKILL_GAP_API_URL}/generate-diagnostic/`,
    calibrateDiagnostic: `${SKILL_GAP_API_URL}/calibrate-diagnostic/`,
  },
}

/**
 * Standard authorization header generator for DRF SimpleJWT.
 * @param {boolean} isJson Whether to set application/json Content-Type (false for FormData uploads)
 */
export function getAuthHeaders(isJson = true) {
  const token = localStorage.getItem('daksh_access_token')
  const headers = {}
  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

/**
 * Helper to construct full media URL for files served by backend.
 */
export function getMediaUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * Centralized fetch client with automatic JWT token attachment, 
 * token refresh retry on 401, and descriptive error formatting.
 */
export async function fetchApi(url, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  const headers = {
    ...getAuthHeaders(!isFormData),
    ...(options.headers || {}),
  }

  if (isFormData) {
    // Let browser set multipart boundary
    delete headers['Content-Type']
  }

  let response
  try {
    response = await fetch(url, { ...options, headers })
  } catch (networkError) {
    const error = new Error('Cannot reach backend server. Please verify backend is running at ' + API_BASE_URL)
    error.isNetworkError = true
    error.originalError = networkError
    throw error
  }

  // Token refresh logic on 401 Unauthorized
  if (
    response.status === 401 &&
    !url.includes('/token/refresh/') &&
    !url.includes('/login/') &&
    !url.includes('/register/')
  ) {
    const refreshToken = localStorage.getItem('daksh_refresh_token')
    if (refreshToken) {
      try {
        const refreshRes = await fetch(API_ENDPOINTS.auth.refreshToken, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        })
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json()
          if (refreshData.access) {
            localStorage.setItem('daksh_access_token', refreshData.access)
            headers['Authorization'] = `Bearer ${refreshData.access}`
            // Retry original request with fresh token
            response = await fetch(url, { ...options, headers })
          }
        } else {
          // Token expired, clear auth session
          localStorage.removeItem('daksh_access_token')
          localStorage.removeItem('daksh_refresh_token')
        }
      } catch (err) {
        console.warn('Silent token refresh failed:', err)
      }
    }
  }

  // Parse JSON response body if available
  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    let message = 'Request failed'
    if (data && typeof data === 'object') {
      if (data.detail) {
        message = data.detail
      } else if (data.message) {
        message = data.message
      } else if (data.non_field_errors) {
        message = Array.isArray(data.non_field_errors)
          ? data.non_field_errors.join(' ')
          : String(data.non_field_errors)
      } else {
        const firstKey = Object.keys(data)[0]
        if (firstKey) {
          const val = data[firstKey]
          message = Array.isArray(val) ? `${firstKey}: ${val.join(' ')}` : `${firstKey}: ${val}`
        }
      }
    } else if (typeof data === 'string' && data.length < 200) {
      message = data
    }

    const err = new Error(message)
    err.status = response.status
    err.data = data
    throw err
  }

  return data
}

