// Утилиты для работы с локальным хранилищем

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'

const storage = {
	/**
	 * Сохраняет токен авторизации
	 * @param {string} token - JWT токен
	 */
	setToken(token) {
		if (token) {
			localStorage.setItem(TOKEN_KEY, token)
		} else {
			localStorage.removeItem(TOKEN_KEY)
		}
	},

	/**
	 * Получает токен авторизации
	 * @returns {string|null} - токен или null
	 */
	getToken() {
		return localStorage.getItem(TOKEN_KEY)
	},

	/**
	 * Сохраняет данные пользователя
	 * @param {object} userData - данные пользователя
	 */
	setUser(userData) {
		if (userData) {
			localStorage.setItem(USER_KEY, JSON.stringify(userData))
		} else {
			localStorage.removeItem(USER_KEY)
		}
	},

	/**
	 * Получает данные пользователя
	 * @returns {object|null} - данные пользователя или null
	 */
	getUser() {
		const userData = localStorage.getItem(USER_KEY)
		if (userData) {
			try {
				return JSON.parse(userData)
			} catch {
				// Обрабатываем ошибку парсинга: возвращаем null при невалидных данных
				return null
			}
		}
		return null
	},

	/**
	 * Очищает все данные авторизации
	 */
	clearAuth() {
		localStorage.removeItem(TOKEN_KEY)
		localStorage.removeItem(USER_KEY)
	},

	/**
	 * Проверяет, авторизован ли пользователь
	 * @returns {boolean} - true если пользователь авторизован
	 */
	isAuthenticated() {
		return !!this.getToken()
	},
}

export default storage
