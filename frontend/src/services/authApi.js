const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/auth";

export const authStorage = {
    getTokens: () => {
        try {
            return {
                access: localStorage.getItem('daksh_access_token'),
                refresh: localStorage.getItem('daksh_refresh_token'),
            }
        } catch {
            return { access: null, refresh: null }
        }
    },
    setTokens: ({ access, refresh }) => {
        if (access) localStorage.setItem('daksh_access_token', access)
        if (refresh) localStorage.setItem('daksh_refresh_token', refresh)
    },
    clearTokens: () => {
        localStorage.removeItem('daksh_access_token')
        localStorage.removeItem('daksh_refresh_token')
        localStorage.removeItem('daksh-user')
    },
}

async function apiRequest(endpoint, options = {}) {
    const { access } = authStorage.getTokens()
    const headers = {
        'Content-Type': 'application/json',
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
        ...options.headers,
    }
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })
    // Handle Token Expiry (401 Unauthorized) by attempting refresh
    if (res.status === 401 && !endpoint.includes('login') && !endpoint.includes('register')) {
        const refreshed = await authApi.refreshToken()
        if (refreshed) {
            // Retry original request once with new token
            headers.Authorization = `Bearer ${refreshed.access}`
            const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            })
            if (!retryRes.ok) {
                const errorData = await retryRes.json().catch(() => ({}))
                throw errorData
            }
            return await retryRes.json()
        } else {
            authStorage.clearTokens()
            window.location.href = '/login'
        }
    }
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
        throw data
    }
    return data
}
export const authApi = {
    // 1. Register candidate
    async register(payload) {
        const data = await apiRequest('/register/', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
        if (data.tokens) authStorage.setTokens(data.tokens)
        return data
    },
    // 2. Login candidate
    async login(email, password) {
        const data = await apiRequest('/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
        if (data.tokens) authStorage.setTokens(data.tokens)
        return data
    },
    // 3. Get Authenticated User Profile & Skills
    async getMe() {
        return await apiRequest('/me/')
    },
    // 4. Refresh Expired Access Token
    async refreshToken() {
        const { refresh } = authStorage.getTokens()
        if (!refresh) return null
        try {
            const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            })
            if (!res.ok) return null
            const data = await res.json()
            if (data.access) {
                localStorage.setItem('daksh_access_token', data.access)
                return data
            }
        } catch {
            return null
        }
        return null
    },
    // 5. Submit Onboarding Data
    async submitOnboarding(payload) {
        return await apiRequest('/onboarding/', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
    // 6. Get Onboarding Status
    async getOnboardingStatus() {
        return await apiRequest('/onboarding/status/')
    },
    // 7. Logout & Blacklist Token
    async logout() {
        const { refresh } = authStorage.getTokens()
        try {
            if (refresh) {
                await apiRequest('/logout/', {
                    method: 'POST',
                    body: JSON.stringify({ refresh }),
                })
            }
        } finally {
            authStorage.clearTokens()
        }
    },
}