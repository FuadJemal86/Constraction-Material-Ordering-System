import React from 'react'
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/700.css"; // Example for bold text
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeParent from './components/homeComponents/HomeParent';
import Body from './components/order cards/Body';
import Cards from './components/order cards/Cards';
import OrderParent from './components/order cards/OrderParent';
import Login from './components/login page/Login';




function App() {
    return (
        <Router>
            <Routes>
                <Route path='' element = {<Login/>} />
                <Route path="/products" element={<OrderParent />}>
                    <Route path='' element={<Cards />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
