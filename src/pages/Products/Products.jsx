import { useEffect, useState } from 'react'
import './Products.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import productImg from '../../assets/product.png'
import { Link } from 'react-router-dom'
import apiClient from '../../utils/api'

const renderStars = rating => {
	if (rating == null) return null
	const rounded = Math.round(rating)
	return (
		<div className='products-item__stars'>
			{Array.from({ length: 5 }).map((_, idx) => (
				<svg
					key={idx}
					width='23'
					height='23'
					viewBox='0 0 42 40'
					fill={idx < rounded ? '#F8B96C' : 'none'}
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
}

const Products = () => {
	const [products, setProducts] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const [productImages, setProductImages] = useState({})

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setIsLoading(true)
				setError(null)
				const response = await apiClient.get('/products', {
					params: { sort: 'name' },
				})
				const data = response.data?.content || []
				setProducts(data)
				data.forEach(prod => {
					if (prod?.id && !productImages[prod.id]) {
						fetchProductImage(prod.id)
					}
				})
			} catch (err) {
				setError(err.message || 'Ошибка при загрузке товаров')
				setProducts([])
			} finally {
				setIsLoading(false)
			}
		}

		fetchProducts()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const fetchProductImage = async productId => {
		if (!productId || productImages[productId]) return
		try {
			const response = await apiClient.get(
				`/images/allByProduct?productId=${productId}`
			)
			const imageData = response.data
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
			console.error('Ошибка загрузки изображения', err)
		}
	}

	return (
		<>
			<Header />
			<main className='products'>
				<div className='products__top'>
					<h1>Товары</h1>
					<h2>НАЙДИТЕ СВОИ ИДЕАЛЬНЫЕ ШТОРЫ</h2>
				</div>

				{isLoading && <p>Загрузка...</p>}
				{error && <p className='products__error'>{error}</p>}

				<section className='products__products-items products-items'>
					{products.map(product => (
						<div
							key={product.id}
							className='products-items__products-item products-item'
						>
							<img
								src={productImages[product.id] || productImg}
								alt={product.name}
							/>
							<div className='products-item__products-info products-info'>
								<div className='products-info__name'>{product.name}</div>
								<div className='products-info__price'>
									{product.price?.toLocaleString('ru-RU')} ₽
								</div>
								<div className='products-info__description description'>
									<span>Ширина: {product.width ?? '—'}</span>
									<span>Высота: {product.height ?? '—'}</span>
									<span>Цвет: {product.color ?? '—'}</span>
									<span className='products-description__quantity'>
										В наличии: {product.stockQuantity ?? '—'}
									</span>
								</div>
							</div>
							<div className='products-item__rating'>
								{renderStars(product.averageRatting)}
								{product.averageRatting != null && (
									<span className='products-item__rating-value'>
										{product.averageRatting.toFixed(1)}
									</span>
								)}
							</div>
							<Link
								to={`/product/${product.id}`}
								className='products-item__btn'
							>
								Подробнее
							</Link>
						</div>
					))}
				</section>
			</main>
			<Footer />
		</>
	)
}

export default Products
