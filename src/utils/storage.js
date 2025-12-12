const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

const storage = {
	setToken(token) {
		if (token) {
			localStorage.setItem(TOKEN_KEY, token)
		} else {
			localStorage.removeItem(TOKEN_KEY)
		}
	},

	getToken() {
		return localStorage.getItem(TOKEN_KEY)
	},

	setUser(userData) {
		if (userData) {
			localStorage.setItem(USER_KEY, JSON.stringify(userData))
		} else {
			localStorage.removeItem(USER_KEY)
		}
	},

	getUser() {
		const userData = localStorage.getItem(USER_KEY)
		if (userData) {
			try {
				return JSON.parse(userData)
			} catch {
				return null
			}
		}
		return null
	},

	clearAuth() {
		localStorage.removeItem(TOKEN_KEY)
		localStorage.removeItem(USER_KEY)
	},

	isAuthenticated() {
		return !!this.getToken()
	},
}

export default storage
