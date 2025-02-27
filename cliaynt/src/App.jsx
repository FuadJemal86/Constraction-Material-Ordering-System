import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Body from './components/homeComponents/Body';
import HomeParent from './components/homeComponents/HomeParent';
import Header from './components/order cards/Header';



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element = {<Header/>} />
            </Routes>
        </Router>
    )
}

export default App
