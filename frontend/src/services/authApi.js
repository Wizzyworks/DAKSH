import { API_ENDPOINTS, fetchApi } from './apiConfig'

export const authApi = {
  /**
   * Authenticate user with email and password via backend Django API
   */
  async login(email, password) {
    const data = await fetchApi(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    })

    if (data?.tokens?.access) {
      localStorage.setItem('daksh_access_token', data.tokens.access)
    }
    if (data?.tokens?.refresh) {
      localStorage.setItem('daksh_refresh_token', data.tokens.refresh)
    }
    if (data?.user) {
      localStorage.setItem('daksh-user', JSON.stringify(data.user))
    }

    return data
  },

  /**
   * Register a new user account with backend Django API
   */
  async register({ email, password, confirm_password, first_name, last_name, phone_number, role = 'candidate' }) {
    const payload = {
      email: email.trim().toLowerCase(),
      password,
      confirm_password: confirm_password || password,
      first_name: first_name || email.split('@')[0],
      last_name: last_name || 'Candidate',
      phone_number: phone_number || '',
      role,
    }

    const data = await fetchApi(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (data?.tokens?.access) {
      localStorage.setItem('daksh_access_token', data.tokens.access)
    }
    if (data?.tokens?.refresh) {
      localStorage.setItem('daksh_refresh_token', data.tokens.refresh)
    }
    if (data?.user) {
      localStorage.setItem('daksh-user', JSON.stringify(data.user))
    }

    return data
  },

  /**
   * Retrieve current authenticated user detail & profile
   */
  async getCurrentUser() {
    return await fetchApi(API_ENDPOINTS.auth.me, {
      method: 'GET',
    })
  },

  /**
   * Retrieve user profile details
   */
  async getProfile() {
    return await fetchApi(API_ENDPOINTS.auth.profile, {
      method: 'GET',
    })
  },

  /**
   * Update user profile partially
   */
  async updateProfile(profileData) {
    return await fetchApi(API_ENDPOINTS.auth.profile, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    })
  },

  /**
   * Submit onboarding details to Django backend
   */
  async submitOnboarding(onboardingData) {
    return await fetchApi(API_ENDPOINTS.auth.onboarding, {
      method: 'POST',
      body: JSON.stringify(onboardingData),
    })
  },

  /**
   * Check onboarding status
   */
  async getOnboardingStatus() {
    return await fetchApi(API_ENDPOINTS.auth.onboardingStatus, {
      method: 'GET',
    })
  },

  /**
   * Logout user and blacklist refresh token on backend
   */
  async logout() {
    const refresh = localStorage.getItem('daksh_refresh_token')
    if (refresh) {
      try {
        await fetchApi(API_ENDPOINTS.auth.logout, {
          method: 'POST',
          body: JSON.stringify({ refresh }),
        })
      } catch (err) {
        console.warn('Backend logout notification failed:', err)
      }
    }

    localStorage.removeItem('daksh_access_token')
    localStorage.removeItem('daksh_refresh_token')
    localStorage.removeItem('daksh-user')
  },
}

