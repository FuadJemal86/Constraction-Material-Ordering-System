import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Body from "../components/homeComponents/Body";
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element = {<Body/>} />
            </Routes>
        </Router>
    )
}

export default App
