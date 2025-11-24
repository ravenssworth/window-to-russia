import './Auth.css'

const Auth = () => {
	return (
		<>
			<header>
				<div>
					<svg></svg>
					<span></span>
				</div>
				<nav>
					<a href='/'>Главная</a>
					<a href='/builder'>Конструктор</a>
					<a href='/orders'>Заказы</a>
				</nav>
			</header>
			<main className='auth'>
				<h1>Авторизация/Регистрация</h1>
			</main>
			<footer>
				<div>
					<svg></svg>
					<span></span>
				</div>
				<div>
					<nav>
						<a href='/'>Главная</a>
						<a href='/builder'>Конструктор</a>
						<a href='/orders'>Заказы</a>
					</nav>
				</div>
				<div>
					<span></span>
					<span></span>
					<span></span>
				</div>
				<div></div>
				<hr />
				<span></span>
			</footer>
		</>
	)
}

export default Auth
