import './Products.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import productImg from '../../assets/product.png'
import { Link } from 'react-router-dom'

const Products = () => {
	return (
		<>
			<Header />
			<main className='products'>
				<div className='products__top'>
					<h1>Товары</h1>
					<h2>СОЗДАЙТЕ СВОИ ИДЕАЛЬНЫЕ ШТОРЫ</h2>
				</div>
				<section className='products__products-items products-items'>
					<div className='products-items__products-item products-item'>
						<img src={productImg} alt='' />
						<div className='products-item__products-info products-info'>
							<div className='products-info__name'>Штора “Вариант 1”</div>
							<div className='products-info__price'>9 999 ₽</div>
							<div className='products-info__description description'>
								<span className='products-description__width'>
									Ширина: 140 см
								</span>
								<span className='products-description__height'>
									Высота: 210 см
								</span>
								<span className='products-description__material'>
									Материал: Блэкаут
								</span>
								<span className='products-description__color'>Цвет: Серый</span>
							</div>
						</div>
						<div className='products-item__rating'>
							<div className='products-item__stars'>
								<svg
									width='23'
									height='23'
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

							<span className='products-item__rating-value'>
								5.0 (24 отзыва)
							</span>
						</div>
						<button className='products-item__btn'>
							<Link to='/product'>Подробнее</Link>
						</button>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}

export default Products
