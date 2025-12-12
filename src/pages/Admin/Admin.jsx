import { useState, useEffect } from 'react'
import './Admin.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import apiClient from '../../utils/api.js'

const Admin = () => {
	const [activeTab, setActiveTab] = useState('products')
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [isAddingNew, setIsAddingNew] = useState(false)
	const [newProduct, setNewProduct] = useState({
		name: '',
		description: '',
		price: '',
		height: '',
		width: '',
		color: '',
		stockQuantity: '',
		image: null,
	})
	const [editingProductId, setEditingProductId] = useState(null)
	const [editingProduct, setEditingProduct] = useState(null)
	const [productImages, setProductImages] = useState({})
	const [orders, setOrders] = useState([])
	const [ordersLoading, setOrdersLoading] = useState(false)
	const [ordersError, setOrdersError] = useState('')
	const [ordersPage, setOrdersPage] = useState(0)
	const [ordersTotalPages, setOrdersTotalPages] = useState(1)

	useEffect(() => {
		if (activeTab === 'products') {
			fetchProducts()
		} else if (activeTab === 'orders') {
			fetchOrders(0)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab])

	const fetchProducts = async () => {
		setLoading(true)
		setError('')
		try {
			const response = await apiClient.get('/products', {
				params: { sort: 'name' },
			})
			const productsList = response.data?.content || []
			setProducts(productsList)

			productsList.forEach(product => {
				if (!productImages[product.id]) {
					fetchProductImage(null, product.id)
				}
			})
		} catch (err) {
			setError(err.message || 'Ошибка при загрузке товаров')
			setProducts([])
		} finally {
			setLoading(false)
		}
	}

	const handleAddProduct = () => {
		setIsAddingNew(true)
		setNewProduct({
			name: '',
			description: '',
			price: '',
			height: '',
			width: '',
			color: '',
			stockQuantity: '',
			image: '',
		})
	}

	const handleNewProductChange = (field, value) => {
		setNewProduct(prev => ({
			...prev,
			[field]: value,
		}))
	}

	const handleSaveNewProduct = async () => {
		if (!newProduct.name || !newProduct.price || !newProduct.stockQuantity) {
			setError('Заполните обязательные поля: название, цена, количество')
			return
		}

		setLoading(true)
		setError('')

		try {
			const productData = {
				name: newProduct.name,
				description: newProduct.description || '',
				price: Number.parseFloat(newProduct.price) || 0.01,
				height: Number.parseFloat(newProduct.height) || 0,
				width: Number.parseFloat(newProduct.width) || 0,
				color: newProduct.color || '',
				stockQuantity: Number.parseInt(newProduct.stockQuantity, 10) || 0,
			}

			const response = await apiClient.post('/products', productData)
			const createdProductId = response.data?.id

			if (newProduct.image && createdProductId) {
				try {
					const formData = new FormData()
					formData.append('image', newProduct.image)

					await apiClient.post(`/images/${createdProductId}`, formData)
					fetchProductImage(null, createdProductId)
				} catch (error_) {
					console.error('Ошибка при загрузке изображения:', error_)
					setError(
						`Товар создан, но не удалось загрузить изображение: ${error_.message}`
					)
				}
			}

			setIsAddingNew(false)
			setNewProduct({
				name: '',
				description: '',
				price: '',
				height: '',
				width: '',
				stockQuantity: '',
				image: null,
			})
			await fetchProducts()
		} catch (err) {
			setError(err.message || 'Ошибка при добавлении товара')
		} finally {
			setLoading(false)
		}
	}

	const handleCancelAdd = () => {
		setIsAddingNew(false)
		setNewProduct({
			name: '',
			description: '',
			price: '',
			height: '',
			width: '',
			color: '',
			stockQuantity: '',
			image: null,
		})
		setError('')
	}

	const handleDelete = async id => {
		if (!globalThis.confirm('Вы уверены, что хотите удалить этот товар?')) {
			return
		}

		setLoading(true)
		setError('')

		try {
			await apiClient.delete(`/products/${id}`)
			await fetchProducts()
		} catch (err) {
			setError(err.message || 'Ошибка при удалении товара')
		} finally {
			setLoading(false)
		}
	}

	const handleEdit = product => {
		setEditingProductId(product.id)
		setEditingProduct({
			name: product.name || '',
			description: product.description || '',
			price: product.price?.toString() || '',
			height: product.height?.toString() || '',
			width: product.width?.toString() || '',
			color: product.color || '',
			stockQuantity: product.stockQuantity?.toString() || '',
			image: null,
		})
		setError('')
		fetchProductImage(null, product.id)
	}

	const handleEditingProductChange = (field, value) => {
		setEditingProduct(prev => ({
			...prev,
			[field]: value,
		}))
	}

	const handleSaveEdit = async () => {
		if (!editingProductId || !editingProduct) return

		if (
			!editingProduct.name ||
			!editingProduct.price ||
			!editingProduct.stockQuantity
		) {
			setError('Заполните обязательные поля: название, цена, количество')
			return
		}

		setLoading(true)
		setError('')

		try {
			const productData = {
				name: editingProduct.name,
				description: editingProduct.description || '',
				price: Number.parseFloat(editingProduct.price) || 0.01,
				height: Number.parseFloat(editingProduct.height) || 0,
				width: Number.parseFloat(editingProduct.width) || 0,
				color: editingProduct.color || '',
				stockQuantity: Number.parseInt(editingProduct.stockQuantity, 10) || 0,
			}

			await apiClient.put(`/products/${editingProductId}`, productData)

			if (editingProduct.image) {
				try {
					const formData = new FormData()
					formData.append('image', editingProduct.image)

					await apiClient.post(`/images/${editingProductId}`, formData)
					fetchProductImage(null, editingProductId)
				} catch (error_) {
					console.error('Ошибка при загрузке изображения:', error_)
					setError(
						`Товар обновлен, но не удалось загрузить изображение: ${error_.message}`
					)
				}
			}

			setEditingProductId(null)
			setEditingProduct(null)
			await fetchProducts()
		} catch (err) {
			setError(err.message || 'Ошибка при обновлении товара')
		} finally {
			setLoading(false)
		}
	}

	const handleCancelEdit = () => {
		setEditingProductId(null)
		setEditingProduct(null)
		setError('')
	}

	const fetchOrders = async (page = ordersPage) => {
		setOrdersLoading(true)
		setOrdersError('')
		try {
			const response = await apiClient.get(`/orders?page=${page}&size=10`)
			setOrders(response.data?.content || [])
			setOrdersTotalPages(response.data?.totalPages || 1)
		} catch (err) {
			setOrdersError(err.message || 'Ошибка при загрузке заказов')
			setOrders([])
		} finally {
			setOrdersLoading(false)
		}
	}

	const handleOrdersPageChange = newPage => {
		setOrdersPage(newPage)
		fetchOrders(newPage)
	}

	const handleStatusChange = async (orderId, newStatus) => {
		setOrdersLoading(true)
		setOrdersError('')

		try {
			await apiClient.put(`/orders/${orderId}`, { status: newStatus })
			await fetchOrders(ordersPage)
		} catch (err) {
			setOrdersError(err.message || 'Ошибка при обновлении статуса заказа')
		} finally {
			setOrdersLoading(false)
		}
	}

	const getStatusOptions = () => {
		return ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
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

	const fetchProductImage = async (imageId, productId) => {
		if (!productId) return

		try {
			const response = await apiClient.get(
				`/images/allByProduct?productId=${productId}`
			)
			const imageData = response.data
			if (imageData?.image) {
				const imageUrl = `data:image/jpeg;base64,${imageData.image}`
				setProductImages(prev => ({
					...prev,
					[productId]: imageUrl,
				}))
			}
		} catch (err) {
			console.error('Ошибка при загрузке изображения:', err)
		}
	}

	const handleImageFileChange = (file, isNewProduct) => {
		if (!file) return

		const maxSize = 10 * 1024 * 1024
		if (file.size > maxSize) {
			setError('Размер файла не должен превышать 10MB')
			return
		}

		if (!file.type.startsWith('image/')) {
			setError('Выберите файл изображения')
			return
		}

		setError('')

		if (isNewProduct) {
			setNewProduct(prev => ({
				...prev,
				image: file,
			}))
		} else {
			setEditingProduct(prev => ({
				...prev,
				image: file,
			}))
		}
	}
	return (
		<>
			<Header />
			<main className='admin'>
				<h1 className='admin__title'>Админ-панель</h1>
				<div className='admin__buttons'>
					<button
						className={`admin__tab ${
							activeTab === 'products' ? 'admin__tab--active' : ''
						}`}
						onClick={() => setActiveTab('products')}
					>
						Товары
					</button>
					<button
						className={`admin__tab ${
							activeTab === 'orders' ? 'admin__tab--active' : ''
						}`}
						onClick={() => setActiveTab('orders')}
					>
						Заказы
					</button>
				</div>

				<div className='admin__content'>
					{activeTab === 'products' ? (
						<div className='admin__admin-products admin-products'>
							<div className='admin__products__top'>
								<h2 className='admin__admin-products-title'>
									Управление товарами
								</h2>
								<button
									onClick={handleAddProduct}
									disabled={isAddingNew || editingProductId !== null}
								>
									Добавить товар
								</button>
							</div>

							{error && <div className='admin__error-message'>{error}</div>}

							{loading && !products.length && (
								<div className='admin__loading-message'>Загрузка...</div>
							)}

							{products.length > 0 && (
								<table className='admin-table__table'>
									<thead>
										<tr>
											<th>ID</th>
											<th>Название</th>
											<th>Описание</th>
											<th>Цена</th>
											<th>Ширина</th>
											<th>Высота</th>
											<th>Цвет</th>
											<th>Количество</th>
											<th>Изображение</th>
											<th>Действия</th>
										</tr>
									</thead>
									<tbody>
										{products.map(product =>
											editingProductId === product.id ? (
												<tr
													key={product.id}
													className='admin-table__row--editing'
												>
													<td>{product.id}</td>
													<td>
														<input
															type='text'
															className='admin-table__input'
															value={editingProduct.name}
															onChange={e =>
																handleEditingProductChange(
																	'name',
																	e.target.value
																)
															}
															placeholder='Название'
														/>
													</td>
													<td>
														<input
															type='text'
															className='admin-table__input'
															value={editingProduct.description}
															onChange={e =>
																handleEditingProductChange(
																	'description',
																	e.target.value
																)
															}
															placeholder='Описание'
														/>
													</td>
													<td>
														<input
															type='number'
															step='0.01'
															min='0.01'
															className='admin-table__input'
															value={editingProduct.price}
															onChange={e =>
																handleEditingProductChange(
																	'price',
																	e.target.value
																)
															}
															placeholder='Цена'
														/>
													</td>
													<td>
														<input
															type='number'
															min='0'
															className='admin-table__input'
															value={editingProduct.width}
															onChange={e =>
																handleEditingProductChange(
																	'width',
																	e.target.value
																)
															}
															placeholder='Ширина'
														/>
													</td>
													<td>
														<input
															type='number'
															min='0'
															className='admin-table__input'
															value={editingProduct.height}
															onChange={e =>
																handleEditingProductChange(
																	'height',
																	e.target.value
																)
															}
															placeholder='Высота'
														/>
													</td>
													<td>
														<input
															type='text'
															className='admin-table__input'
															value={editingProduct.color}
															onChange={e =>
																handleEditingProductChange(
																	'color',
																	e.target.value
																)
															}
															placeholder='Цвет'
														/>
													</td>
													<td>
														<input
															type='number'
															min='0'
															className='admin-table__input'
															value={editingProduct.stockQuantity}
															onChange={e =>
																handleEditingProductChange(
																	'stockQuantity',
																	e.target.value
																)
															}
															placeholder='Количество'
														/>
													</td>
													<td>
														<input
															type='file'
															accept='image/*'
															className='admin-table__file-input'
															onChange={e => {
																const file = e.target.files?.[0]
																if (file) {
																	handleImageFileChange(file, false)
																}
															}}
														/>
														{editingProduct.image && (
															<div className='admin-table__image-selected'>
																Изображение выбрано
															</div>
														)}
													</td>
													<td>
														<div className='actions'>
															<button
																className='actions__btn actions__btn--save'
																onClick={handleSaveEdit}
																disabled={loading}
															>
																✓
															</button>
															<button
																className='actions__btn actions__btn--cancel'
																onClick={handleCancelEdit}
																disabled={loading}
															>
																✕
															</button>
														</div>
													</td>
												</tr>
											) : (
												<tr key={product.id}>
													<td>{product.id}</td>
													<td>{product.name}</td>
													<td>{product.description || '-'}</td>
													<td>{product.price?.toLocaleString('ru-RU')} ₽</td>
													<td>{product.width || '-'}</td>
													<td>{product.height || '-'}</td>
													<td>{product.color || '-'}</td>
													<td>{product.stockQuantity}</td>
													<td>
														{(() => {
															if (productImages[product.id]) {
																return (
																	<img
																		src={productImages[product.id]}
																		alt={product.name}
																		className='admin-table__product-image'
																	/>
																)
															}
															return (
																<span className='admin-table__no-image'>
																	Изображение не загружено
																</span>
															)
														})()}
													</td>
													<td>
														<div className='actions'>
															<button
																className='actions__btn actions__btn--edit'
																onClick={() => handleEdit(product)}
																disabled={
																	isAddingNew || editingProductId !== null
																}
															>
																✏️
															</button>
															<button
																className='actions__btn actions__btn--delete'
																onClick={() => handleDelete(product.id)}
																disabled={
																	loading ||
																	isAddingNew ||
																	editingProductId !== null
																}
															>
																🗑️
															</button>
														</div>
													</td>
												</tr>
											)
										)}

										{isAddingNew && (
											<tr className='admin-table__row--editing'>
												<td>-</td>
												<td>
													<input
														type='text'
														className='admin-table__input admin-table__input--new'
														value={newProduct.name}
														onChange={e =>
															handleNewProductChange('name', e.target.value)
														}
														placeholder='Название'
													/>
												</td>
												<td>
													<input
														type='text'
														className='admin-table__input admin-table__input--new'
														value={newProduct.description}
														onChange={e =>
															handleNewProductChange(
																'description',
																e.target.value
															)
														}
														placeholder='Описание'
													/>
												</td>
												<td>
													<input
														type='number'
														step='0.01'
														min='0.01'
														className='admin-table__input admin-table__input--new'
														value={newProduct.price}
														onChange={e =>
															handleNewProductChange('price', e.target.value)
														}
														placeholder='Цена'
													/>
												</td>
												<td>
													<input
														type='number'
														min='0'
														className='admin-table__input admin-table__input--new'
														value={newProduct.width}
														onChange={e =>
															handleNewProductChange('width', e.target.value)
														}
														placeholder='Ширина'
													/>
												</td>
												<td>
													<input
														type='number'
														min='0'
														className='admin-table__input admin-table__input--new'
														value={newProduct.height}
														onChange={e =>
															handleNewProductChange('height', e.target.value)
														}
														placeholder='Высота'
													/>
												</td>
												<td>
													<input
														type='text'
														className='admin-table__input admin-table__input--new'
														value={newProduct.color}
														onChange={e =>
															handleNewProductChange('color', e.target.value)
														}
														placeholder='Цвет'
													/>
												</td>
												<td>
													<input
														type='number'
														min='0'
														className='admin-table__input'
														value={newProduct.stockQuantity}
														onChange={e =>
															handleNewProductChange(
																'stockQuantity',
																e.target.value
															)
														}
														placeholder='Количество'
													/>
												</td>
												<td>
													<input
														type='file'
														accept='image/*'
														className='admin-table__file-input'
														onChange={e => {
															const file = e.target.files?.[0]
															if (file) {
																handleImageFileChange(file, true)
															}
														}}
													/>
													{newProduct.image && (
														<div className='admin-table__image-selected'>
															Изображение выбрано
														</div>
													)}
												</td>
												<td>
													<div className='actions'>
														<button
															className='actions__btn actions__btn--save'
															onClick={handleSaveNewProduct}
															disabled={loading}
														>
															✓
														</button>
														<button
															className='actions__btn actions__btn--cancel'
															onClick={handleCancelAdd}
															disabled={loading}
														>
															✕
														</button>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</table>
							)}

							{!loading && products.length === 0 && !isAddingNew && (
								<div className='admin__empty-message'>Товары не найдены</div>
							)}
						</div>
					) : (
						<div className='admin__admin-orders admin-orders'>
							<h2 className='admin__admin-orders-title'>Управление заказами</h2>

							{ordersError && (
								<div className='admin__error-message'>{ordersError}</div>
							)}

							{ordersLoading && !orders.length && (
								<div className='admin__loading-message'>Загрузка...</div>
							)}

							{orders.length > 0 && (
								<table className='admin-table__table'>
									<thead>
										<tr>
											<th>ID заказа</th>
											<th>Пользователь</th>
											<th>Общая цена</th>
											<th>Статус</th>
											<th>Дата создания</th>
										</tr>
									</thead>
									<tbody>
										{orders.map(order => (
											<tr key={order.id}>
												<td>{order.id}</td>
												<td>{order.user?.username || order.user?.id || '-'}</td>
												<td>{order.totalPrice?.toLocaleString('ru-RU')} ₽</td>
												<td>
													<select
														className='admin-table__status-select'
														value={order.status || 'PENDING'}
														onChange={e =>
															handleStatusChange(order.id, e.target.value)
														}
														disabled={ordersLoading}
													>
														{getStatusOptions().map(status => (
															<option key={status} value={status}>
																{getStatusTranslation(status)}
															</option>
														))}
													</select>
												</td>
												<td>
													{order.createdAt
														? new Date(order.createdAt).toLocaleDateString(
																'ru-RU'
														  )
														: '-'}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}

							{!ordersLoading && orders.length === 0 && (
								<div className='admin__empty-message'>Заказы не найдены</div>
							)}

							{ordersTotalPages > 1 && (
								<Pagination
									currentPage={ordersPage}
									totalPages={ordersTotalPages}
									onPageChange={handleOrdersPageChange}
								/>
							)}
						</div>
					)}
				</div>
			</main>
			<Footer />
		</>
	)
}

export default Admin
