import axios from 'axios'
import { auth } from './auth'
import storage from './storage'

// Конфигурация API
//
// По умолчанию (разработка): http://localhost:8080/api/v1
//
// Для изменения создайте файл .env в корне проекта:
//
// Для тестов с удалённым сервером:
// VITE_API_BASE_URL=https://окно-в.рф/api/v1
//
// Для продакшена (относительный путь):
// VITE_API_BASE_URL=/api/v1

const getApiBaseUrl = () => {
	// Если установлена переменная окружения, используем её
	if (import.meta.env.VITE_API_BASE_URL) {
		return import.meta.env.VITE_API_BASE_URL
	}

	// По умолчанию для разработки используем localhost:8080
	// Для продакшена установите VITE_API_BASE_URL=/api/v1 в .env файле
	return 'http://localhost:8080/api/v1'
}

const API_BASE_URL = getApiBaseUrl()

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 60000,
})

// Интерцептор запросов - добавляет токен авторизации
apiClient.interceptors.request.use(
	config => {
		const token = storage.getToken()
		if (token && !auth.isTokenExpired(token)) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// Интерцептор ответов - обрабатывает ошибки
apiClient.interceptors.response.use(
	response => {
		return response
	},
	error => {
		// Если получили 401, очищаем авторизацию и перенаправляем на логин
		if (error.response?.status === 401) {
			storage.clearAuth()
			globalThis.location.href = '/auth'
		}

		const errorMessage =
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			'Произошла ошибка'

		const apiError = new Error(errorMessage)
		apiError.status = error.response?.status
		apiError.data = error.response?.data

		return Promise.reject(apiError)
	}
)

export default apiClient
