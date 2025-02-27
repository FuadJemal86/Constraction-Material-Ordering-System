import React from 'react'
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import logo from '../../images/logo constraction.jpeg';
import { Link } from 'react-router-dom';
import '@fontsource/roboto';


function Footer() {
    return (
        <div className='bg-slate-100'>
            <div>
                <div className=' w-full sm:flex grid sm:p-12 p-5 '>
                    <div className=' w-28 h-28 text-left'>
                        <img className='' src= {logo} alt="" srcset="" />
                    </div>

                    <div className='w-full '>
                        <nav className='grid sm:flex gap-4 sm:justify-center text-left font-medium' style={{fontFamily: 'Roboto, sans-serif'}}>
                            <ul>Contact Us</ul>
                            <ul>About Us</ul>
                            <ul>Help Center</ul>
                            <ul>Blong Posts</ul>
                        </nav>
                    </div>

                    <div className='w-full flex gap-4 sm:justify-end justify-center mt-6'>
                        <Link><FaFacebook size={24} /></Link>
                        <Link><FaInstagram size={24} /></Link>
                        <Link><FaGithub size={24} /></Link>
                        <Link><FaLinkedin size={24} /></Link>
                    </div>
                </div>
            </div>
            <div className='px-28'>
                <hr />
            </div>
            <div>
                <div>
                    <p className='text-center py-4 text-slate-400'>2025 Constraction Material Ordering System. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Footer
