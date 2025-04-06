import React from 'react'
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/700.css"; // Example for bold text
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeParent from './components/homeComponents/HomeParent';
import Cards from './components/order cards/Cards';
import OrderParent from './components/order cards/OrderParent';
import Login from './components/login page/Login';
import Nav from './components/SupplyNav/Nav';
import SupplierOrders from './components/SupplyNav/SupplierOrders';
import Product from './components/SupplyNav/Product';
import AddProduct from './components/SupplyNav/AddProduct';
import Payment from './components/SupplyNav/Payment';
import SignIn from './components/login page/SignIn';
import CustomerSignIn from './components/customer/CustomerSignIn';
import SignUp from './components/customer/SignUp';
import Nearby from './components/SupplyNav/Nearby';
import PaymentForm from './components/order cards/PaymentForm';
import OrderItem from './components/SupplyNav/OrderItem';



function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<HomeParent />} />
                <Route path='/sign-up' element={<Login />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/customer-sign-in' element={<CustomerSignIn />} />
                <Route path='/customer-sign-up' element={<SignUp />} />
                <Route path="/products" element={<OrderParent />}>
                    <Route path='/products/supplier-products/:id' element={<Cards />} />
                    <Route path='nearby' element={<Nearby />} />
                    <Route path='payment-form/:id' element={<PaymentForm />} />
                </Route>

                <Route path="/supplier-page" element={<Nav />}>
                    <Route path='order' element={<SupplierOrders />} />
                    <Route path='product' element={<Product />} />
                    <Route path='add-product' element={<AddProduct />} />
                    <Route path='payment' element={<Payment />} />
                    <Route path='order-item' element={<OrderItem />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
