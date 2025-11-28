import './Orders.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import productImg from '../../assets/product.png'

const Orders = () => {
	return (
		<>
			<Header />
			<main className='orders'>
				<h1 className='orders__title'>Мои заказы</h1>
				<h2 className='orders__description'>
					Пример текста для описания страницы
				</h2>
				<section className='orders__content'>
					<div className='orders__orders-order orders-order'>
						<div className='orders-order__id-date-status-total'>
							<div className='orders-order__id-date'>
								<span className='orders-order__id'>Заказ №12345</span>
								<span className='orders-order__date'>15.10.2025</span>
							</div>
							<span className='orders-order__status'>В обработке</span>
							<span className='orders-order__total'>
								Итого: <em>9 999 ₽</em>
							</span>
						</div>
						<div className='orders-order__order-item order-item'>
							<div className='order-item__img-name-description-button-count'>
								<img src={productImg} alt='' />
								<div className='order-item__name-description-button-count'>
									<span className='order-item__name'>Штора “Вариант 1”</span>
									<div className='order-item__description-button'>
										<div className='order-item__description'>
											<span>Ширина: 140 см</span>
											<span>Высота: 210 см</span>
											<span>Материал: Блэкаут</span>
											<span>Цвет: Серый</span>
										</div>
										<button className='order-item__button'>
											Оставить отзыв
										</button>
									</div>
									<span className='order-item__count'>1 шт</span>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}

export default Orders
