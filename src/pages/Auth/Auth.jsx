import { useState } from 'react'
import './Auth.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'

const Auth = () => {
	const [activeTab, setActiveTab] = useState('login')

	return (
		<>
			<Header />
			<main className='auth'>
				<div className='auth__container'>
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

					<div className='auth__form'>
						{activeTab === 'register' && (
							<div className='auth__form-group'>
								<label htmlFor='name'>Имя:</label>
								<input type='text' id='name' name='name' />
							</div>
						)}

						<div className='auth__form-group'>
							<label htmlFor='email'>Email:</label>
							<input type='email' id='email' name='email' />
						</div>

						<div className='auth__form-group'>
							<label htmlFor='password'>Пароль:</label>
							<input type='password' id='password' name='password' />
						</div>

						{activeTab === 'register' && (
							<div className='auth__form-group'>
								<label htmlFor='confirmPassword'>Подтвердите пароль:</label>
								<input
									type='password'
									id='confirmPassword'
									name='confirmPassword'
								/>
							</div>
						)}
					</div>

					<button className='auth__submit'>
						{activeTab === 'login' ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
					</button>
				</div>
			</main>
			<Footer />
		</>
	)
}

export default Auth
