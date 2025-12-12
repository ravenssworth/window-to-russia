import { useEffect, useState } from 'react'
import './Orders.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import productImg from '../../assets/product.png'
import apiClient from '../../utils/api'

const Orders = () => {
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [productImages, setProductImages] = useState({})
	const [reviewModalOpen, setReviewModalOpen] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [reviewText, setReviewText] = useState('')
	const [reviewRating, setReviewRating] = useState(5)
	const [reviewLoading, setReviewLoading] = useState(false)
	const [reviewError, setReviewError] = useState('')
	const [userReviews, setUserReviews] = useState([])
	const [editingReviewId, setEditingReviewId] = useState(null)

	useEffect(() => {
		const loadOrders = async () => {
			try {
				setLoading(true)
				setError('')
				const res = await apiClient.get('/orders/my-orders')
				const data = res.data || []
				setOrders(data)
				data.forEach(order => {
					;(order.orderItems || []).forEach(item => {
						const pid = item.productReadDTO?.id
						if (pid && !productImages[pid]) {
							fetchImage(pid)
						}
					})
				})
			} catch (err) {
				setError(err.message || 'Не удалось загрузить заказы')
				setOrders([])
			} finally {
				setLoading(false)
			}
		}

		loadOrders()
	}, [])

	const fetchImage = async productId => {
		if (!productId || productImages[productId]) return
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
				setProductImages(prev => ({
					...prev,
					[productId]: `data:image/jpeg;base64,${base64}`,
				}))
			}
		} catch (err) {
			console.error('Не удалось загрузить изображение товара', err)
		}
	}

	const formatDate = dateStr => {
		if (!dateStr) return '-'
		return new Date(dateStr).toLocaleDateString('ru-RU')
	}

	const getStatusTranslation = status => {
		const translations = {
			PENDING: 'Ожидает',
			PROCESSING: 'Обрабатывается',
			SHIPPED: 'Отправлен',
			DELIVERED: 'Доставлен',
			CANCELLED: 'Отменен',
		}
		return translations[status] || status
	}

	const loadUserReviews = async () => {
		try {
			const response = await apiClient.get('/reviews/me')
			const data = response.data || []
			const reviews = Array.isArray(data)
				? data
				: data.content || data.items || []
			setUserReviews(reviews)
		} catch (err) {
			console.error('Ошибка при загрузке отзывов:', err)
			setUserReviews([])
		}
	}

	useEffect(() => {
		loadUserReviews()
	}, [])

	const getReviewForProduct = productId => {
		if (!Array.isArray(userReviews)) {
			return null
		}
		return userReviews.find(
			review => Number(review.productId) === Number(productId)
		)
	}

	const handleOpenReviewModal = product => {
		const existingReview = getReviewForProduct(product.id)
		setSelectedProduct(product)
		if (existingReview) {
			setEditingReviewId(existingReview.id)
			setReviewText(existingReview.text || '')
			setReviewRating(existingReview.rating || 5)
		} else {
			setEditingReviewId(null)
			setReviewText('')
			setReviewRating(5)
		}
		setReviewError('')
		setReviewModalOpen(true)
	}

	const handleCloseReviewModal = () => {
		setReviewModalOpen(false)
		setSelectedProduct(null)
		setReviewText('')
		setReviewRating(5)
		setReviewError('')
		setEditingReviewId(null)
	}

	const handleSubmitReview = async () => {
		if (!selectedProduct) return
		if (!reviewText.trim()) {
			setReviewError('Введите текст отзыва')
			return
		}

		setReviewLoading(true)
		setReviewError('')

		try {
			if (editingReviewId) {
				await apiClient.put(`/reviews/${editingReviewId}`, {
					productId: selectedProduct.id,
					text: reviewText,
					rating: reviewRating,
				})
			} else {
				await apiClient.post('/reviews', {
					productId: selectedProduct.id,
					text: reviewText,
					rating: reviewRating,
				})
			}
			await loadUserReviews()
			handleCloseReviewModal()
		} catch (err) {
			setReviewError(err.message || 'Не удалось сохранить отзыв')
		} finally {
			setReviewLoading(false)
		}
	}

	return (
		<>
			<Header />
			<main className='orders'>
				<h1 className='orders__title'>Мои заказы</h1>
				<h2 className='orders__description'>Список ваших заказов</h2>
				<section className='orders__content'>
					{loading && <p>Загрузка...</p>}
					{error && <div className='orders__error'>{error}</div>}
					{!loading && !orders.length && !error && (
						<div className='orders__empty'>Заказы не найдены</div>
					)}

					{orders.map(order => (
						<div className='orders__orders-order orders-order' key={order.id}>
							<div className='orders-order__id-date-status-total'>
								<div className='orders-order__id-date'>
									<span className='orders-order__id'>Заказ №{order.id}</span>
									<span className='orders-order__date'>
										{formatDate(order.createdAt)}
									</span>
								</div>
								<span
									className={`orders-order__status ${
										order.status === 'DELIVERED'
											? 'orders-order__status--delivered'
											: ''
									}`}
								>
									{getStatusTranslation(order.status)}
								</span>
								<span className='orders-order__total'>
									Итого: <em>{order.totalPrice?.toLocaleString('ru-RU')} ₽</em>
								</span>
							</div>
							<div className='orders-order__order-items orders-items'>
								{(order.orderItems || []).map(item => {
									const product = item.productReadDTO || {}
									const pid = product.id
									return (
										<div
											className='orders-items__order-item order-item'
											key={item.id}
										>
											<div className='order-item__img-name-description-button-count'>
												<img
													src={productImages[pid] || productImg}
													alt={product.name}
												/>
												<div className='order-item__name-description-button-count'>
													<span className='order-item__name'>
														{product.name || 'Товар'}
													</span>
													<div className='order-item__description-button'>
														<div className='order-item__description'>
															<span>Ширина: {product.width ?? '—'}</span>
															<span>Высота: {product.height ?? '—'}</span>
															<span>Цвет: {product.color ?? '—'}</span>
														</div>
														<button
															className='order-item__button'
															onClick={() => handleOpenReviewModal(product)}
														>
															{getReviewForProduct(pid)
																? 'Редактировать отзыв'
																: 'Оставить отзыв'}
														</button>
													</div>
													<span className='order-item__count'>
														{item.quantity ?? 0} шт
													</span>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					))}
				</section>
			</main>
			{reviewModalOpen && (
				<div
					className='orders__review-modal-overlay'
					onClick={handleCloseReviewModal}
				>
					<div
						className='orders__review-modal'
						onClick={e => e.stopPropagation()}
					>
						<div className='orders__review-modal-header'>
							<h3>
								{editingReviewId ? 'Редактировать отзыв' : 'Оставить отзыв'}
							</h3>
							<button
								className='orders__review-modal-close'
								onClick={handleCloseReviewModal}
							>
								×
							</button>
						</div>
						<div className='orders__review-modal-content'>
							{selectedProduct && (
								<div className='orders__review-product-info'>
									<span className='orders__review-product-name'>
										{selectedProduct.name}
									</span>
								</div>
							)}
							<div className='orders__review-rating'>
								<label>Оценка:</label>
								<div className='orders__review-stars'>
									{[1, 2, 3, 4, 5].map(star => (
										<button
											key={star}
											type='button'
											className={`orders__review-star ${
												star <= reviewRating
													? 'orders__review-star--active'
													: ''
											}`}
											onClick={() => setReviewRating(star)}
										>
											★
										</button>
									))}
								</div>
							</div>
							<div className='orders__review-text'>
								<label htmlFor='review-text'>Текст отзыва:</label>
								<textarea
									id='review-text'
									value={reviewText}
									onChange={e => setReviewText(e.target.value)}
									placeholder='Напишите ваш отзыв...'
									rows={5}
								/>
							</div>
							{reviewError && (
								<div className='orders__review-error'>{reviewError}</div>
							)}
							<div className='orders__review-actions'>
								<button
									className='orders__review-submit'
									onClick={handleSubmitReview}
									disabled={reviewLoading}
								>
									{reviewLoading ? 'Сохранение...' : 'Сохранить'}
								</button>
								<button
									className='orders__review-cancel'
									onClick={handleCloseReviewModal}
									disabled={reviewLoading}
								>
									Отмена
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			<Footer />
		</>
	)
}

export default Orders
