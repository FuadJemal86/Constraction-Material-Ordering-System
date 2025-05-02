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
import MyAccount from './components/customerDetail/MyAccount';
import ViewDetails from './components/customerDetail/ViewDetails';
import PaymentTransaction from './components/customerDetail/PaymentTransaction';
import SupplierVerification from './components/SupplyNav/SupplierVerification';
import DonePayment from './components/SupplyNav/DonePayment';



function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<HomeParent />} />
                <Route path='/sign-up' element={<Login />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/order-items/:id' element={<ViewDetails />} />
                <Route path='/customer-sign-in' element={<CustomerSignIn />} />
                <Route path='/customer-sign-up' element={<SignUp />} />
                <Route path='/payment-form/:transactionId' element={<PaymentForm />} />
                <Route path='/payment-transaction/:transactionId' element={<PaymentTransaction />} />
                <Route path="/products" element={<OrderParent />}>
                    <Route path='/products/supplier-products/:id' element={<Cards />} />
                    <Route path='nearby' element={<Nearby />} />
                </Route>
                <Route path='/my-account' element={<MyAccount />} />


                <Route path='/supplier-verification' element={<SupplierVerification />} />
                <Route path="/supplier-page" element={<Nav />}>
                    <Route path='order' element={<SupplierOrders />} />
                    <Route path='product' element={<Product />} />
                    <Route path='add-product' element={<AddProduct />} />
                    <Route path='payment' element={<Payment />} />
                    <Route path='order-item' element={<OrderItem />} />
                    <Route path='done-payment' element={<DonePayment />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
