import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import './Product.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import productImg from '../../assets/product.png'
import apiClient from '../../utils/api'

const Product = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [currentPage, setCurrentPage] = useState(0)
	const [reviewsTotalPages, setReviewsTotalPages] = useState(1)
	const [isAdding, setIsAdding] = useState(false)
	const [inCart, setInCart] = useState(false)
	const [checkingCart, setCheckingCart] = useState(true)
	const [product, setProduct] = useState(null)
	const [productError, setProductError] = useState('')
	const [productLoading, setProductLoading] = useState(true)
	const [reviews, setReviews] = useState([])
	const [reviewsLoading, setReviewsLoading] = useState(false)
	const [reviewsError, setReviewsError] = useState('')
	const [productImage, setProductImage] = useState(null)

	const pageSize = 3

	const handlePageChange = newPage => {
		setCurrentPage(newPage)
	}

	const renderStars = useMemo(
		() => rating => {
			if (rating == null) return null
			const rounded = Math.round(rating)
			return (
				<div className='product__stars'>
					{Array.from({ length: 5 }).map((_, idx) => (
						<svg
							key={idx}
							width='23'
							height='23'
							viewBox='0 0 42 40'
							fill={idx < rounded ? '#F8B96C' : '#E0E0E0'}
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M20.7331 0L25.6275 15.0634H41.4661L28.6524 24.3731L33.5468 39.4365L20.7331 30.1268L7.91938 39.4365L12.8138 24.3731L7.24792e-05 15.0634H15.8387L20.7331 0Z'
								fill={idx < rounded ? '#F8B96C' : '#E0E0E0'}
							/>
						</svg>
					))}
				</div>
			)
		},
		[]
	)

	useEffect(() => {
		setCurrentPage(0)
	}, [id])

	useEffect(() => {
		const loadProduct = async () => {
			if (!id) {
				setProductError('Не указан ID товара')
				setProductLoading(false)
				return
			}
			try {
				setProductLoading(true)
				setProductError('')
				const response = await apiClient.get(`/products/${id}`)
				setProduct(response.data)
			} catch (err) {
				setProductError(err.message || 'Не удалось загрузить товар')
			} finally {
				setProductLoading(false)
			}
		}

		loadProduct()
	}, [id])

	useEffect(() => {
		const loadImage = async () => {
			if (!id) return
			try {
				const response = await apiClient.get(
					`/images/allByProduct?productId=${id}`
				)
				const imageData = response.data
				const base64 =
					typeof imageData === 'string'
						? imageData
						: imageData?.image || imageData?.data
				if (base64) {
					setProductImage(`data:image/jpeg;base64,${base64}`)
				}
			} catch (err) {
				console.error('Ошибка загрузки изображения товара', err)
			}
		}

		loadImage()
	}, [id])

	useEffect(() => {
		const checkCart = async () => {
			if (!id) {
				setCheckingCart(false)
				return
			}
			try {
				setCheckingCart(true)

				const response = await apiClient.get('/cart')
				const items = response.data?.items ?? response.data?.content ?? []
				const exists = items.some(
					item => String(item.productId ?? item.product?.id) === String(id)
				)
				setInCart(exists)
			} catch (err) {
				console.error(err)
			} finally {
				setCheckingCart(false)
			}
		}

		checkCart()
	}, [id])

	useEffect(() => {
		const loadReviews = async () => {
			if (!id) return
			try {
				setReviewsLoading(true)
				setReviewsError('')
				const response = await apiClient.get(`/reviews/product/${id}`, {
					params: { page: currentPage, size: pageSize },
				})
				const data = response.data || {}
				const content = data.content ?? data.items ?? []
				setReviews(content)
				setReviewsTotalPages(data.totalPages ?? data.total_pages ?? 1)
			} catch (err) {
				setReviewsError(err.message || 'Не удалось загрузить отзывы')
				setReviews([])
				setReviewsTotalPages(1)
			} finally {
				setReviewsLoading(false)
			}
		}

		loadReviews()
	}, [id, currentPage])

	const handleAddToCart = async () => {
		if (inCart) {
			navigate('/cart')
			return
		}
		if (!id) {
			return
		}
		try {
			setIsAdding(true)

			await apiClient.post('/cart/items', {
				productId: Number(id),
				quantity: 1,
			})
			setInCart(true)
		} catch (err) {
			console.error(err)
		} finally {
			setIsAdding(false)
		}
	}

	return (
		<>
			<Header />
			<main className='product'>
				<div className='product__top'>
					<h1>Товары</h1>
					<h2>НАЙДИТЕ СВОИ ИДЕАЛЬНЫЕ ШТОРЫ</h2>
				</div>
				<section className='product__content'>
					<div className='product__breadcrumb'>
						<Link to='/products' className='product__breadcrumb-link'>
							Товары
						</Link>
						<span className='product__breadcrumb-separator'> &gt; </span>
						<span className='product__breadcrumb-current'>
							Подробнее о товаре
						</span>
					</div>
					<div className='product__item'>
						<div className='product__img'>
							<img src={productImage || productImg} alt='' />
							<span className='product__name'>{product?.name || 'Товар'}</span>
						</div>
						<div className='product__info info'>
							<span className='info__name'>
								{product?.name?.toUpperCase() || 'ТОВАР'}
							</span>
							<div className='info__description'>
								<div className='info__stroke'>
									<span className='info__title'>Ширина:</span>
									<span className='info__value'>{product?.width ?? '—'}</span>
								</div>
								<div className='info__stroke'>
									<span className='info__title'>Высота:</span>
									<span className='info__value'>{product?.height ?? '—'}</span>
								</div>
								<div className='info__stroke'>
									<span className='info__title'>Цвет:</span>
									<span className='info__value'>{product?.color ?? '—'}</span>
								</div>
								<div className='info__stroke'>
									<span className='info__title'>В наличии:</span>
									<span className='info__value'>
										{product?.stockQuantity ?? '—'}
									</span>
								</div>
							</div>
							<div className='product__rating'>
								{renderStars(product?.averageRatting)}
								{product?.averageRatting != null && (
									<span className='product__rating-value'>
										{Number(product.averageRatting).toFixed(1)}
									</span>
								)}
							</div>

							{productError && (
								<div className='product__error'>{productError}</div>
							)}
							<button
								className='product__btn'
								onClick={handleAddToCart}
								disabled={isAdding || checkingCart || productLoading}
							>
								{inCart
									? 'Товар в корзине — перейти в корзину'
									: isAdding
									? 'Добавляем...'
									: 'Добавить в корзину'}{' '}
								<br />
								{!inCart && product?.price != null && (
									<span>{product.price.toLocaleString('ru-RU')} ₽</span>
								)}
							</button>
						</div>
					</div>
				</section>
				<section className='product__reviews-section reviews-section'>
					<h1 className='reviews-section__title'>ОТЗЫВЫ</h1>
					{reviewsError && <div className='product__error'>{reviewsError}</div>}
					{reviewsLoading ? (
						<p>Загрузка отзывов...</p>
					) : (
						<div className='reviews-section__reviews reviews'>
							{reviews.length === 0 ? (
								<p className='reviews__no-reviews'> Отзывов пока нет</p>
							) : (
								reviews.map(review => (
									<div className='reviews__review review' key={review.id}>
										<span className='review__name'>
											{review.authorName || 'Пользователь'}
										</span>
										<div className='review__rating'>
											{renderStars(review.rating ?? review.stars)}
										</div>
										<span className='review__text'>
											{review.text || review.content || ''}
										</span>
									</div>
								))
							)}
						</div>
					)}
					{reviewsTotalPages > 1 && (
						<Pagination
							currentPage={currentPage}
							totalPages={reviewsTotalPages}
							onPageChange={handlePageChange}
						/>
					)}
				</section>
			</main>
			<Footer />
		</>
	)
}

export default Product
