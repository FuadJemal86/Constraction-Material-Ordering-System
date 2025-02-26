import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Body from './components/homeComponents/Body';
import HomeParent from './components/homeComponents/HomeParent';



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element = {<HomeParent/>} />
            </Routes>
        </Router>
    )
}

export default App
