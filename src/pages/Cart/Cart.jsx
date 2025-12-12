import React, { useEffect, useState } from 'react'
import './Cart.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import productImg from '../../assets/product.png'
import apiClient from '../../utils/api'

function Cart() {
	const [cart, setCart] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [itemImages, setItemImages] = useState({})
	// eslint-disable-next-line no-unused-vars
	const [updatingItemId, setUpdatingItemId] = useState(null)
	const [checkoutOpen, setCheckoutOpen] = useState(false)
	const [checkoutPhone, setCheckoutPhone] = useState('')
	const [checkoutAddress, setCheckoutAddress] = useState('')
	const [checkoutLoading, setCheckoutLoading] = useState(false)
	const [checkoutError, setCheckoutError] = useState('')
	const [checkoutSuccess, setCheckoutSuccess] = useState('')

	const fetchImage = async productId => {
		if (!productId || itemImages[productId]) return
		try {
			const res = await apiClient.get(
				`/images/allByProduct?productId=${productId}`
			)
			const imageData = res.data
			const base64 =
				typeof imageData === 'string'
					? imageData
					: imageData?.image || imageData?.data
			if (base64) {
				setItemImages(prev => ({
					...prev,
					[productId]: `data:image/jpeg;base64,${base64}`,
				}))
			}
		} catch (err) {
			console.error('Ошибка загрузки изображения товара', err)
		}
	}

	const loadCart = async () => {
		try {
			setLoading(true)
			setError('')
			const res = await apiClient.get('/cart')
			const data = res.data
			setCart(data)
			;(data?.items || []).forEach(item => {
				const productId = item.productReadDTO?.id || item.productId
				if (productId) fetchImage(productId)
			})
		} catch (err) {
			setError(err.message || 'Не удалось загрузить корзину')
			setCart(null)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadCart()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const deleteItem = async cartItemId => {
		setUpdatingItemId(cartItemId)
		try {
			await apiClient.delete(`/cart/items/${cartItemId}`)
		} catch (err) {
			console.error(err)
			setError(err.message || 'Не удалось удалить товар')
		} finally {
			setUpdatingItemId(null)
			await loadCart()
		}
	}

	const updateQuantity = async (cartItemId, newQty) => {
		if (!cartItemId) return
		if (newQty < 1) {
			await deleteItem(cartItemId)
			return
		}
		setUpdatingItemId(cartItemId)
		try {
			const response = await apiClient.put(`/cart/items/${cartItemId}`, {
				quantity: newQty,
			})
			const updatedCart = response.data
			if (updatedCart) {
				setCart(updatedCart)
			} else {
				await loadCart()
			}
		} catch (err) {
			console.error(err)
			setError(err.message || 'Не удалось обновить количество')
			await loadCart()
		} finally {
			setUpdatingItemId(null)
		}
	}

	const handleCountChange = (item, delta) => {
		const cartItemId = item.id
		const currentQty = item.quantity ?? 0
		const newQty = currentQty + delta
		setCart(prev => {
			if (!prev) return prev
			return {
				...prev,
				items: prev.items.map(it =>
					it.id === cartItemId ? { ...it, quantity: Math.max(newQty, 0) } : it
				),
			}
		})
		updateQuantity(cartItemId, newQty)
	}

	const handleCheckout = async () => {
		if (!checkoutPhone || !checkoutAddress) {
			setCheckoutError('Укажите телефон и адрес')
			return
		}
		try {
			setCheckoutLoading(true)
			setCheckoutError('')
			setCheckoutSuccess('')
			const response = await apiClient.post('/orders/from-cart', {
				phoneNumber: checkoutPhone,
				shippingAddress: checkoutAddress,
			})
			const confirmationUrl = response.data?.payment?.confirmationUrl
			if (confirmationUrl) {
				window.location.href = confirmationUrl
			} else {
				setCheckoutSuccess('Заказ создан')
				setTimeout(() => {
					setCheckoutOpen(false)
					setCheckoutSuccess('')
					loadCart()
				}, 2000)
			}
		} catch (err) {
			setCheckoutError(err.message || 'Не удалось создать заказ')
		} finally {
			setCheckoutLoading(false)
		}
	}

	const items = cart?.items || []
	const itemsCount = items.length
	const [grandTotal, setGrandTotal] = useState(0)

	useEffect(() => {
		if (!cart || !cart.items) {
			setGrandTotal(0)
			return
		}
		const total = cart.items.reduce((sum, item) => {
			const itemTotal =
				item.totalPrice ?? item.pricePerItem * (item.quantity ?? 0)
			return sum + (itemTotal || 0)
		}, 0)
		setGrandTotal(total)
	}, [cart])

	return (
		<div>
			<Header />
			<main className='cart'>
				<h1 className='cart__title'>Корзина</h1>
				{loading && <p className='cart__loading'>Загрузка...</p>}
				{error && <div className='cart__error'>{error}</div>}
				{!loading && !items.length && !error && (
					<h2 className='cart__description'>Корзина пуста</h2>
				)}
				{!loading && items.length > 0 && !error && (
					<section className='cart__content'>
						<div className='cart__left-column'>
							{items.map(item => {
								const product = item.productReadDTO || {}
								const productId = product.id || item.productId
								const price =
									item.pricePerItem != null ? item.pricePerItem : product.price
								return (
									<div className='cart__cart-item cart-item' key={item.id}>
										<img
											src={itemImages[productId] || productImg}
											alt={product.name}
										/>
										<div className='cart-item__cart-item-content cart-item-info'>
											<span className='cart-item-info__name'>
												{product.name || item.productName || 'Товар'}
											</span>
											<span className='cart-item-info__width'>
												Ширина: {product.width ?? '—'} см
											</span>
											<span className='cart-item-info__height'>
												Высота: {product.height ?? '—'} см
											</span>
											<span className='cart-item-info__color'>
												Цвет: {product.color ?? '—'}
											</span>
											<div className='cart-item-info__price-count'>
												<span className='cart-item-info__price'>
													{price != null
														? `${price.toLocaleString('ru-RU')} ₽`
														: '—'}
												</span>
												<div className='cart-item-info__count count'>
													<div
														className='count__plus'
														onClick={() => handleCountChange(item, 1)}
													>
														+
													</div>
													<div className='count__number'>
														{item.quantity ?? 0}
													</div>
													<div
														className='count__minus'
														onClick={() => handleCountChange(item, -1)}
													>
														-
													</div>
												</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
						<div className='cart__right-column'>
							<h3>ИТОГ ЗАКАЗА</h3>
							<div className='cart__cart-total cart-total'>
								<div className='cart-total__item'>
									<span className='cart-total__label'>
										Товары ({itemsCount} шт.)
									</span>
									<span className='cart-total__price'>
										{grandTotal.toLocaleString('ru-RU')}
									</span>
								</div>
								<div className='cart-total__item'>
									<span className='cart-total__label'>Доставка </span>
									<span className='cart-total__price'>0</span>
								</div>
								<div className='cart-total__item'>
									<span className='cart-total__total-label'>Итого</span>
									<span className='cart-total__price'>
										{grandTotal.toLocaleString('ru-RU')}
									</span>
								</div>
							</div>

							{checkoutOpen && (
								<div className='cart__checkout-modal'>
									<div className='cart__checkout-body'>
										<h4>Оформление заказа</h4>
										{checkoutError && (
											<div className='cart__checkout-error'>
												{checkoutError}
											</div>
										)}
										{checkoutSuccess && (
											<div className='cart__checkout-success'>
												{checkoutSuccess}
											</div>
										)}
										<label className='cart__checkout-label'>
											Телефон
											<input
												type='tel'
												value={checkoutPhone}
												onChange={e => setCheckoutPhone(e.target.value)}
												disabled={checkoutSuccess}
											/>
										</label>
										<label className='cart__checkout-label'>
											Адрес
											<input
												type='text'
												value={checkoutAddress}
												onChange={e => setCheckoutAddress(e.target.value)}
												disabled={checkoutSuccess}
											/>
										</label>
										<div className='cart__checkout-actions'>
											<button
												onClick={handleCheckout}
												disabled={checkoutLoading}
											>
												{checkoutLoading ? 'Отправка...' : 'Подтвердить'}
											</button>
											<button onClick={() => setCheckoutOpen(false)}>
												Отмена
											</button>
										</div>
									</div>
								</div>
							)}
							<button
								className='cart__checkout-button'
								onClick={() => setCheckoutOpen(true)}
							>
								Перейти к оплате
							</button>
						</div>
					</section>
				)}
			</main>
			<Footer />
		</div>
	)
}

export default Cart
