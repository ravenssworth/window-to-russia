export const auth = {
	isTokenExpired(token) {
		if (!token) return true

		try {
			const payload = JSON.parse(atob(token.split('.')[1]))

			if (payload.exp) {
				const expirationTime = payload.exp * 1000
				return Date.now() >= expirationTime
			}

			return false
		} catch {
			return true
		}
	},

	decodeToken(token) {
		if (!token) return null

		try {
			const payload = JSON.parse(atob(token.split('.')[1]))
			return payload
		} catch {
			return null
		}
	},
}
