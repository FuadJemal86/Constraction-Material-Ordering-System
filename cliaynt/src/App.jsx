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




function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element = {<HomeParent/>} />
                <Route path='/sign-up' element = {<Login/>} />
                <Route path="/products" element={<OrderParent />}>
                    <Route path='' element={<Cards />} />
                </Route>

                <Route path="/supplier-page" element={<Nav />}>
                    <Route path='order' element={<SupplierOrders />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
