import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home.jsx'
import Auth from './pages/Auth/Auth.jsx'
import Products from './pages/Products/Products.jsx'
import Product from './pages/Product/Product.jsx'
import Cart from './pages/Cart/Cart.jsx'
import Admin from './pages/Admin/Admin.jsx'
import Orders from './pages/Orders/Orders.jsx'

function App() {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/auth' element={<Auth />} />
			<Route path='/products' element={<Products />} />
			<Route path='/product' element={<Product />} />
			<Route path='/cart' element={<Cart />} />
			<Route path='/admin' element={<Admin />} />
			<Route path='/orders' element={<Orders />} />
		</Routes>
	)
}

export default App
