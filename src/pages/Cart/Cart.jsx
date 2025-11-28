import React from 'react'
import './Cart.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import productImg from '../../assets/product.png'

function Cart() {
	return (
		<div>
			<Header />
			<main className='cart'>
				<h1 className='cart__title'>Корзина</h1>
				<h2 className='cart__description'>
					Пример текста для описания корзины
				</h2>
				<section className='cart__content'>
					<div className='cart__left-column'>
						<div className='cart__cart-item cart-item'>
							<img src={productImg} alt='' />
							<div className='cart-item__cart-item-content cart-item-info'>
								<span className='cart-item-info__name'>Штора “Вариант 1”</span>
								<span className='cart-item-info__width'>Ширина: 140 см</span>
								<span className='cart-item-info__height'>Высота: 210 см</span>
								<span className='cart-item-info__material'>
									Материал: Блэкаут
								</span>
								<span className='cart-item-info__color'>Цвет: Серый</span>
								<div className='cart-item-info__price-count'>
									<span className='cart-item-info__price'>9 999 ₽</span>
									<div className='cart-item-info__count count'>
										<div className='count__plus'>+</div>
										<div className='count__number'>1</div>
										<div className='count__minus'>-</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='cart__right-column'>
						<h3>ИТОГ ЗАКАЗА</h3>
						<div className='cart__cart-total cart-total'>
							<div className='cart-total__item'>
								<span className='cart-total__label'>Товары (3 шт.) </span>
								<span className='cart-total__price'>9 999</span>
							</div>
							<div className='cart-total__item'>
								<span className='cart-total__label'>Доставка </span>
								<span className='cart-total__price'>9999</span>
							</div>
							<div className='cart-total__item'>
								<span className='cart-total__total-label'>Итого</span>
								<span className='cart-total__price'>10 998</span>
							</div>
						</div>
						<button>Перейти к оплате</button>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}

export default Cart
