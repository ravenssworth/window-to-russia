import './Home.css'
import mainImg from '../../assets/main.png'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'

const Home = () => {
	return (
		<div className='home'>
			<Header />
			<main>
				<h1>
					<em>Окно в Россию.</em> Свет под вашим контролем.
				</h1>
				<section className='home__section-first section-first'>
					<h2>Комфорт, экономия и безопасность в одном касании.</h2>
					<div className='section-first__content'>
						<img src={mainImg} alt='Основное' />
						<div className='section-first__text'>
							<span className='section-first__title'>
								<em>УМНЫЕ</em> <br /> РУЛОННЫЕ ШТОРЫ <br /> для вашего комфорта{' '}
								<br />
							</span>
							<span className='section-first__description'>
								Компания <em>«Окно в Россию»</em> — ведущий поставщик
								инновационных решений для <br /> вашего дома. <br />
								Наша миссия — объединить передовые технологии c безупречным
								дизайном, <br /> чтобы создать безупречный комфорт.
							</span>
							<hr />
						</div>
					</div>
				</section>
				<section className='home__section-second section-second'>
					<h2>ПОЧЕМУ ВЫБИРАЮТ НАС?</h2>
					<div className='section-second__blocks'>
						<div className='section-second__block block'>
							<span className='block__title'>Умное управление</span>
							<hr />
							<ol>
								<li>Единое приложение для всех штор в доме</li>
								<li>Точная регулировка освещения</li>
								<li>Голосовое управление (Алиса, Siri)</li>
								<li>Автоматизация по расписанию</li>
							</ol>
						</div>
						<div className='section-second__block block'>
							<span className='block__title'>Непревзойденный комфорт</span>
							<hr />
							<ol>
								<li>Идеальный микроклимат (защита от перегрева)</li>
								<li>Создание сцен для сна, кино, работы</li>
								<li>Полная тишина и плавность хода</li>
								<li>Простая и надежная установка на любое окно</li>
							</ol>
						</div>
						<div className='section-second__block block'>
							<span className='block__title'>Энергоэффективность</span>
							<hr />
							<ol>
								<li>Экономия на кондиционировании до 30%</li>
								<li>Защита мебели и отделки от выцветания</li>
								<li>Автоматическое закрытие в ваше </li>
							</ol>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}

export default Home
