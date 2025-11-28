import './Product.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import productImg from '../../assets/product.png'

const product = () => {
	return (
		<>
			<Header />
			<main className='product'>
				<div className='product__top'>
					<h1>Товары</h1>
					<h2>СОЗДАЙТЕ СВОИ ИДЕАЛЬНЫЕ ШТОРЫ</h2>
				</div>
				<section className='product__content'>
					<span className='product__link'>Товары &gt; Подробнее о товаре</span>
					<div className='product__item'>
						<div className='product__img'>
							<img src={productImg} alt='' />
							<span className='product__name'>Штора "Название"</span>
						</div>
						<div className='product__info info'>
							<span className='info__name'>ШТОРА "НАЗВАНИЕ"</span>
							<div className='info__description'>
								<div className='info__stroke'>
									<span className='info__title'>Ширина:</span>
									<span className='info__value'>140 см</span>
								</div>
								<div className='info__stroke'>
									<span className='info__title'>Высота:</span>
									<span className='info__value'>210 см</span>
								</div>
								<div className='info__stroke'>
									<span className='info__title'>Материал:</span>
									<span className='info__value'>Блэкаут</span>
								</div>
								<div className='info__stroke'>
									<span className='info__title'>Цвет:</span>
									<span className='info__value'>Серый</span>
								</div>
							</div>
							<div className='product__rating'>
								<svg
									width='42'
									height='40'
									viewBox='0 0 42 40'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M20.7331 0L25.6275 15.0634H41.4661L28.6524 24.3731L33.5468 39.4365L20.7331 30.1268L7.91938 39.4365L12.8138 24.3731L7.24792e-05 15.0634H15.8387L20.7331 0Z'
										fill='#F8B96C'
									/>
								</svg>
								<span className='product__rating-value'>5.0 (24 отзыва)</span>
							</div>
							<button className='product__btn'>
								Добавить в корзину <br />
								<span>10 000 ₽</span>
							</button>
						</div>
					</div>
				</section>
				<section className='product__reviews-section reviews-section'>
					<h1 className='reviews-section__title'>ОТЗЫВЫ</h1>
					<div className='reviews-section__reviews reviews'>
						<div className='reviews__review review'>
							<span className='review__name'>АННА ПЕТРОВА</span>
							<div className='review__rating'>
								<svg
									width='42'
									height='40'
									viewBox='0 0 42 40'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M20.7331 0L25.6275 15.0634H41.4661L28.6524 24.3731L33.5468 39.4365L20.7331 30.1268L7.91938 39.4365L12.8138 24.3731L7.24792e-05 15.0634H15.8387L20.7331 0Z'
										fill='#F8B96C'
									/>
								</svg>
							</div>
							<span className='review__text'>
								Отличные шторы! Качество материала на высоте, цвет соответствует
								фото. Очень довольна покупкой.
							</span>
						</div>
					</div>
					<div className='reviews-section__pagination pagination'>
						<svg
							width='25'
							height='45'
							viewBox='0 0 25 45'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M1.11919e-06 22.1737L24.9944 2.39807e-05L24.9944 44.3474L1.11919e-06 22.1737Z'
								fill='#9CA8A9'
								fill-opacity='0.39'
							/>
						</svg>
						<span className='pagination__numbers'>1 2 3 ... 12</span>
						<svg
							width='25'
							height='45'
							viewBox='0 0 25 45'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M24.9944 22.1737L1.69851e-05 44.3474L1.89235e-05 -1.4444e-05L24.9944 22.1737Z'
								fill='#9CA8A9'
								fill-opacity='0.39'
							/>
						</svg>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}

export default product
