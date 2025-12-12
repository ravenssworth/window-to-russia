import { useState } from 'react'
import './Auth.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import apiClient from '../../utils/api.js'
import storage from '../../utils/storage.js'
import { auth } from '../../utils/auth.js'

const Auth = () => {
	const [activeTab, setActiveTab] = useState('login')
	const [formData, setFormData] = useState({
		username: '',
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		password: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
		setError('')
		setSuccess('')
	}

	const handleRegister = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')
		setSuccess('')

		try {
			await apiClient.post('/users/register', {
				username: formData.username,
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phoneNumber: formData.phoneNumber,
				password: formData.password,
			})

			setSuccess('Регистрация прошла успешно!')

			setFormData({
				username: '',
				firstName: '',
				lastName: '',
				email: '',
				phoneNumber: '',
				password: '',
			})

			setTimeout(() => {
				setActiveTab('login')
				setSuccess('')
			}, 2000)
		} catch (err) {
			setError(err.message || 'Произошла ошибка при регистрации')
		} finally {
			setLoading(false)
		}
	}

	const resolveToken = data => {
		if (!data) return ''
		if (typeof data === 'string') return data
		return data.token || data.jwt || data.accessToken || ''
	}

	const isAdminFromRoles = roles => {
		let list = []
		if (Array.isArray(roles)) {
			list = roles
		} else if (roles) {
			list = [roles]
		}
		return list.some(role => String(role).toUpperCase().includes('ADMIN'))
	}

	const checkAdminByRequest = async () => {
		try {
			await apiClient.get('/users')
			return true
		} catch {
			return false
		}
	}

	const handleLogin = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')
		setSuccess('')

		try {
			const response = await apiClient.post('/users/login', {
				username: formData.username,
				password: formData.password,
			})

			const responseData = response.data
			if (
				typeof responseData === 'string' &&
				(responseData.toLowerCase().includes('bad credentials') ||
					responseData.toLowerCase().includes('error') ||
					responseData.toLowerCase().includes('неверные'))
			) {
				throw new Error('Неверное имя пользователя или пароль')
			}

			const token = resolveToken(responseData)
			if (!token || token.toLowerCase().includes('bad credentials')) {
				throw new Error('Неверное имя пользователя или пароль')
			}

			storage.setToken(token)

			const payload = auth.decodeToken(token) || {}
			const roles = payload.roles || payload.authorities || payload.role
			const hasAdminRole = isAdminFromRoles(roles)

			const adminByRequest = hasAdminRole ? false : await checkAdminByRequest()

			const userData = {
				username: payload.sub || payload.username || formData.username,
				firstName: payload.firstName || '',
				lastName: payload.lastName || '',
				role: hasAdminRole || adminByRequest ? 'ADMIN' : 'USER',
			}

			storage.setUser(userData)
			setSuccess('Вход выполнен успешно!')

			setFormData(prev => ({
				...prev,
				password: '',
			}))

			setTimeout(() => {
				globalThis.location.href = '/'
			}, 800)
		} catch (err) {
			setError(err.message || 'Произошла ошибка при входе')
		} finally {
			setLoading(false)
		}
	}

	const getButtonText = () => {
		if (loading) return 'ЗАГРУЗКА...'
		return activeTab === 'login' ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'
	}

	return (
		<>
			<Header />
			<main className='auth'>
				<div
					className={`auth__container ${
						activeTab === 'login'
							? 'auth__container--login'
							: 'auth__container--register'
					}`}
				>
					<span className='auth__title'>ДОБРО ПОЖАЛОВАТЬ</span>
					<span className='auth__text'>
						ВОЙДИТЕ В СВОЙ АККАУНТ ИЛИ СОЗДАЙТЕ НОВЫЙ
					</span>
					<div className='auth__tabs'>
						<button
							className={`auth__tab auth__tab--login ${
								activeTab === 'login' ? 'auth__tab--active' : ''
							}`}
							onClick={() => setActiveTab('login')}
						>
							ВХОД
						</button>
						<button
							className={`auth__tab auth__tab--register ${
								activeTab === 'register' ? 'auth__tab--active' : ''
							}`}
							onClick={() => setActiveTab('register')}
						>
							РЕГИСТРАЦИЯ
						</button>
						<div className='auth__tab-line'>
							<div
								className={`auth__tab-indicator ${
									activeTab === 'login'
										? 'auth__tab-indicator--left'
										: 'auth__tab-indicator--right'
								}`}
							></div>
						</div>
					</div>

					{error && (
						<div
							style={{
								color: 'red',
								margin: ' 1.3021vw 0 0.7813vw 16.7188vw',
								fontSize: '1.0416vw',
							}}
						>
							{error}
						</div>
					)}

					{success && (
						<div
							style={{
								color: 'green',
								margin: ' 1.3021vw 0 0.7813vw 16.7188vw',
								fontSize: '1.0416vw',
							}}
						>
							{success}
						</div>
					)}

					<form
						className='auth__form'
						onSubmit={activeTab === 'login' ? handleLogin : handleRegister}
					>
						{activeTab === 'login' ? (
							<>
								<div className='auth__form-group'>
									<label htmlFor='username'>Имя пользователя:</label>
									<input
										type='text'
										id='username'
										name='username'
										value={formData.username}
										onChange={handleChange}
										required
									/>
								</div>

								<div className='auth__form-group'>
									<label htmlFor='password'>Пароль:</label>
									<input
										type='password'
										id='password'
										name='password'
										value={formData.password}
										onChange={handleChange}
										required
									/>
								</div>
							</>
						) : (
							<>
								<div className='auth__form-group'>
									<label htmlFor='username'>Имя пользователя:</label>
									<input
										type='text'
										id='username'
										name='username'
										value={formData.username}
										onChange={handleChange}
										required
									/>
								</div>

								<div className='auth__form-group'>
									<label htmlFor='firstName'>Имя:</label>
									<input
										type='text'
										id='firstName'
										name='firstName'
										value={formData.firstName}
										onChange={handleChange}
										required
									/>
								</div>

								<div className='auth__form-group'>
									<label htmlFor='lastName'>Фамилия:</label>
									<input
										type='text'
										id='lastName'
										name='lastName'
										value={formData.lastName}
										onChange={handleChange}
										required
									/>
								</div>

								<div className='auth__form-group'>
									<label htmlFor='email'>Email:</label>
									<input
										type='email'
										id='email'
										name='email'
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</div>

								<div className='auth__form-group'>
									<label htmlFor='phoneNumber'>Номер телефона:</label>
									<input
										type='tel'
										id='phoneNumber'
										name='phoneNumber'
										value={formData.phoneNumber}
										onChange={handleChange}
										required
									/>
								</div>

								<div className='auth__form-group'>
									<label htmlFor='password'>Пароль:</label>
									<input
										type='password'
										id='password'
										name='password'
										value={formData.password}
										onChange={handleChange}
										required
									/>
								</div>
							</>
						)}

						<button type='submit' className='auth__submit' disabled={loading}>
							{getButtonText()}
						</button>
					</form>
				</div>
			</main>
			<Footer />
		</>
	)
}

export default Auth
