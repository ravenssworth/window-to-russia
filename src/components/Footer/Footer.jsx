import React from 'react'
import './Footer.css'
import logoImg from '../../assets/logo.png'

function Footer() {
	return (
		<div>
			<footer className='footer'>
				<div className='footer__container'>
					<div className='footer__first'>
						<img src={logoImg} alt='Логотип' />
						<span>
							Компания <em>«Окно в Россию»</em> — ведущий поставщик
							инновационных решений для вашего дома. <br />
							Наша миссия — объединить передовые технологии c безупречным
							дизайном, чтобы создать безупречный комфорт.
						</span>
					</div>
					<div className='footer__second'>
						<span className='footer__title'>ССЫЛКИ</span>
						<nav>
							<a href='/'>Главная</a>
							<a href='/builder'>Конструктор</a>
							<a href='/orders'>Заказы</a>
						</nav>
					</div>
					<div className='footer_third'>
						<span className='footer__title'>КОНТАКТЫ</span>
						<div>
							<span>+7 111 111 11 11</span>
							<span>info@gmail.com</span>
							<span>https://www.www.www</span>
						</div>
					</div>
					<div>
						<span className='footer__title'>АДРЕС</span>
					</div>
				</div>
				<hr />
				<span className='footer__copyright'>2025, ООО “Окно в россию”</span>
			</footer>
		</div>
	)
}

export default Footer
