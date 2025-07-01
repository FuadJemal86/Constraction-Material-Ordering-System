import React, { useState } from 'react'
import Header from './Header'
import Body from './Body'
import Footer from './Footer'
import { BlinkBlur, FourSquare } from 'react-loading-indicators'


function HomeParent() {
    const [loading, setLoading] = useState(true)

    setTimeout(() => {
        setLoading(false)
    }, 3000);
    if (loading) {
        return (
            <div className=''>
                <div className="absolute inset-0 flex justify-center items-center text-center bg-white/70 z-30">
                    <BlinkBlur color="#385d38" size="medium" text="" textColor="" />
                </div>
            </div>
        )
    }
    return (
        <div>
            <Header />
            <Body />
            <Footer />
        </div>
    )
}

export default HomeParent
