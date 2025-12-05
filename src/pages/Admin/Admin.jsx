import { useState, useEffect } from 'react'
import './Admin.css'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
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
		stockQuantity: '',
	})
	const [editingProductId, setEditingProductId] = useState(null)
	const [editingProduct, setEditingProduct] = useState(null)

	useEffect(() => {
		if (activeTab === 'products') {
			fetchProducts()
		}
	}, [activeTab])

	const fetchProducts = async () => {
		setLoading(true)
		setError('')
		try {
			const response = await apiClient.get('/products')
			setProducts(response.data?.content || [])
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
			stockQuantity: '',
		})
	}

	const handleNewProductChange = (field, value) => {
		setNewProduct(prev => ({
			...prev,
			[field]: value,
		}))
	}

	const handleSaveNewProduct = async () => {
		// Валидация
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
				price: parseFloat(newProduct.price) || 0.01,
				height: parseFloat(newProduct.height) || 0,
				width: parseFloat(newProduct.width) || 0,
				stockQuantity: parseInt(newProduct.stockQuantity, 10) || 0,
			}

			await apiClient.post('/products', productData)
			setIsAddingNew(false)
			// Обновляем список товаров
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
			stockQuantity: '',
		})
		setError('')
	}

	const handleDelete = async id => {
		if (
			!globalThis.confirm(
				'Вы уверены, что хотите удалить этот товар?'
			)
		) {
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
			stockQuantity: product.stockQuantity?.toString() || '',
		})
		setError('')
	}

	const handleEditingProductChange = (field, value) => {
		setEditingProduct(prev => ({
			...prev,
			[field]: value,
		}))
	}

	const handleSaveEdit = async () => {
		if (!editingProductId || !editingProduct) return

		// Валидация
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
				price: parseFloat(editingProduct.price) || 0.01,
				height: parseFloat(editingProduct.height) || 0,
				width: parseFloat(editingProduct.width) || 0,
				stockQuantity: parseInt(editingProduct.stockQuantity, 10) || 0,
			}

			await apiClient.put(`/products/${editingProductId}`, productData)
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

							{error && (
								<div
									style={{
										color: 'red',
										margin: '10px 0',
										fontSize: '16px',
									}}
								>
									{error}
								</div>
							)}

							{loading && !products.length && (
								<div style={{ margin: '20px 0', fontSize: '18px' }}>
									Загрузка...
								</div>
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
											<th>Количество</th>
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
															value={editingProduct.name}
															onChange={e =>
																handleEditingProductChange(
																	'name',
																	e.target.value
																)
															}
															placeholder='Название'
															style={{
																width: '100%',
																padding: '4px',
																border: '1px solid #ccc',
																borderRadius: '4px',
															}}
														/>
													</td>
													<td>
														<input
															type='text'
															value={editingProduct.description}
															onChange={e =>
																handleEditingProductChange(
																	'description',
																	e.target.value
																)
															}
															placeholder='Описание'
															style={{
																width: '100%',
																padding: '4px',
																border: '1px solid #ccc',
																borderRadius: '4px',
															}}
														/>
													</td>
													<td>
														<input
															type='number'
															step='0.01'
															min='0.01'
															value={editingProduct.price}
															onChange={e =>
																handleEditingProductChange(
																	'price',
																	e.target.value
																)
															}
															placeholder='Цена'
															style={{
																width: '100%',
																padding: '4px',
																border: '1px solid #ccc',
																borderRadius: '4px',
															}}
														/>
													</td>
													<td>
														<input
															type='number'
															min='0'
															value={editingProduct.width}
															onChange={e =>
																handleEditingProductChange(
																	'width',
																	e.target.value
																)
															}
															placeholder='Ширина'
															style={{
																width: '100%',
																padding: '4px',
																border: '1px solid #ccc',
																borderRadius: '4px',
															}}
														/>
													</td>
													<td>
														<input
															type='number'
															min='0'
															value={editingProduct.height}
															onChange={e =>
																handleEditingProductChange(
																	'height',
																	e.target.value
																)
															}
															placeholder='Высота'
															style={{
																width: '100%',
																padding: '4px',
																border: '1px solid #ccc',
																borderRadius: '4px',
															}}
														/>
													</td>
													<td>
														<input
															type='number'
															min='0'
															value={editingProduct.stockQuantity}
															onChange={e =>
																handleEditingProductChange(
																	'stockQuantity',
																	e.target.value
																)
															}
															placeholder='Количество'
															style={{
																width: '100%',
																padding: '4px',
																border: '1px solid #ccc',
																borderRadius: '4px',
															}}
														/>
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
													<td>
														{product.price?.toLocaleString('ru-RU')} ₽
													</td>
													<td>{product.width || '-'}</td>
													<td>{product.height || '-'}</td>
													<td>{product.stockQuantity}</td>
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
														value={newProduct.name}
														onChange={e =>
															handleNewProductChange('name', e.target.value)
														}
														placeholder='Название'
														style={{
															width: '100%',
															padding: '4px',
															border: '1px solid #ccc',
															borderRadius: '4px',
														}}
													/>
												</td>
												<td>
													<input
														type='text'
														value={newProduct.description}
														onChange={e =>
															handleNewProductChange(
																'description',
																e.target.value
															)
														}
														placeholder='Описание'
														style={{
															width: '100%',
															padding: '4px',
															border: '1px solid #ccc',
															borderRadius: '4px',
														}}
													/>
												</td>
												<td>
													<input
														type='number'
														step='0.01'
														min='0.01'
														value={newProduct.price}
														onChange={e =>
															handleNewProductChange('price', e.target.value)
														}
														placeholder='Цена'
														style={{
															width: '100%',
															padding: '4px',
															border: '1px solid #ccc',
															borderRadius: '4px',
														}}
													/>
												</td>
												<td>
													<input
														type='number'
														min='0'
														value={newProduct.width}
														onChange={e =>
															handleNewProductChange('width', e.target.value)
														}
														placeholder='Ширина'
														style={{
															width: '100%',
															padding: '4px',
															border: '1px solid #ccc',
															borderRadius: '4px',
														}}
													/>
												</td>
												<td>
													<input
														type='number'
														min='0'
														value={newProduct.height}
														onChange={e =>
															handleNewProductChange('height', e.target.value)
														}
														placeholder='Высота'
														style={{
															width: '100%',
															padding: '4px',
															border: '1px solid #ccc',
															borderRadius: '4px',
														}}
													/>
												</td>
												<td>
													<input
														type='number'
														min='0'
														value={newProduct.stockQuantity}
														onChange={e =>
															handleNewProductChange(
																'stockQuantity',
																e.target.value
															)
														}
														placeholder='Количество'
														style={{
															width: '100%',
															padding: '4px',
															border: '1px solid #ccc',
															borderRadius: '4px',
														}}
													/>
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
								<div style={{ margin: '20px 0', fontSize: '18px' }}>
									Товары не найдены
								</div>
							)}
						</div>
					) : (
						<div className='admin__admin-orders admin-orders'>
							<h2 className='admin__admin-orders-title'>Управление заказами</h2>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</>
	)
}

export default Admin
