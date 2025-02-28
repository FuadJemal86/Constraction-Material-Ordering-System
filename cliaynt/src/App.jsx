import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeParent from './components/homeComponents/HomeParent';
import Body from './components/order cards/Body';
import Cards from './components/order cards/Cards';
import OrderParent from './components/order cards/OrderParent';




function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element = {<HomeParent/>} />
                <Route path="/products" element={<OrderParent />}>
                    <Route path='' element={<Cards />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
