// Утилиты для работы с авторизацией

export const auth = {
	/**
	 * Проверяет, истёк ли токен
	 * @param {string} token - JWT токен
	 * @returns {boolean} - true если токен истёк или невалиден
	 */
	isTokenExpired(token) {
		if (!token) return true

		try {
			// Декодируем JWT токен (без проверки подписи)
			const payload = JSON.parse(atob(token.split('.')[1]))

			// Проверяем срок действия токена
			if (payload.exp) {
				const expirationTime = payload.exp * 1000 // конвертируем в миллисекунды
				return Date.now() >= expirationTime
			}

			return false
		} catch {
			// Если не удалось декодировать токен, считаем его истёкшим
			return true
		}
	},

	/**
	 * Декодирует JWT токен и возвращает payload
	 * @param {string} token - JWT токен
	 * @returns {object|null} - payload токена или null
	 */
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
