import React from 'react'
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import logo from '../../images/jejan.svg';
import { Link, useNavigate } from 'react-router-dom';
import '@fontsource/roboto';


function Footer() {
    const navigatore = useNavigate()

    const handleNaviget = () => {
        window.open('https://officaltechreach.vercel.app/', '_blank');
    }


    const handleNavigetAbout = () => {
        navigatore('/about-us')

    }
    return (
        <div className='bg-slate-100 dark:bg-gray-950'>
            <div>
                <div className=' w-full sm:flex grid sm:p-12 p-5 '>
                    <div className='flex items-center gap-2 w-full'>
                        <div className=' p-1 text-left'>
                            <img
                                className="relative w-56 h-24"
                                src={logo}
                                alt="ConstructEasy Logo"
                            />
                        </div>

                        <div className='w-full p-2'>
                            <nav className='' >
                                <ul className='grid sm:flex gap-4 sm:justify-center text-left font-medium' style={{ fontFamily: 'Roboto, sans-serif' }}>
                                    <li onClick={handleNaviget} className='cursor-pointer'>Contact Us</li>
                                    <li onClick={handleNavigetAbout} className='cursor-pointer'>About Us</li>
                                    <li>Help Center</li>
                                    <li>Blog Posts</li>
                                </ul>
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
            </div>
            <div className='px-28'>
                <hr />
            </div>
            <div>
                <div>
                    <p className='text-center py-4 text-slate-400 text-sm md:text-base'>© 2025 Jejan E-Commerce. All rights reserved.</p>
                    <Link className='text-center py-4 text-slate-400 text-sm md:text-base'>developed by Tech Reach</Link>
                </div>
            </div>
        </div>
    )
}

export default Footer
