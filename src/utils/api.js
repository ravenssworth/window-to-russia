import axios from 'axios'
import { auth } from './auth'
import storage from './storage'

const getApiBaseUrl = () => {
	if (import.meta.env.VITE_API_BASE_URL) {
		return import.meta.env.VITE_API_BASE_URL
	}

	return 'http://localhost:8080/api/v1'
}

const API_BASE_URL = getApiBaseUrl()

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 60000,
})

apiClient.interceptors.request.use(
	config => {
		const token = storage.getToken()
		if (token && !auth.isTokenExpired(token)) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		if (!(config.data instanceof FormData)) {
			config.headers['Content-Type'] = 'application/json'
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

apiClient.interceptors.response.use(
	response => {
		return response
	},
	error => {
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
