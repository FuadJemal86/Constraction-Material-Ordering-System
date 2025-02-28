import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import logo from '../../images/logo constraction.jpeg';
import bannerImage from '../../images/banner2 page2.jpg'; // Add your banner image path here
import { LightMode, DarkMode } from "@mui/icons-material";
import { Menu, X, Wrench, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';


function Header() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <div>
            <div>
                <header className="relative">
                    <div className='flex items-center justify-between md:p-2 p-1 fixed right-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-md'>
                        <div className='flex items-center'>
                            <img className='w-12 h-12 md:w-16 md:h-16 dark:bg-white rounded-full' src={logo} alt="ConstracEase Logo" />

                            <div className='font-bold text-lg md:text-2xl md:px-2'>
                                <p>ConstracEase</p>
                            </div>
                        </div>

                        <div className='hidden md:flex justify-center w-full'>
                            <nav>
                                <ul className='flex gap-6 font-semibold'>
                                    <li><Link className="hover:text-yellow-500 transition-colors">Home</Link></li>
                                    <li><Link className="hover:text-yellow-500 transition-colors">Catagory</Link></li>
                                    <li><Link className="hover:text-yellow-500 transition-colors">About Us</Link></li>
                                    <li><Link className="hover:text-yellow-500 transition-colors">Contact</Link></li>
                                </ul>
                            </nav>
                        </div>

                        <div className="relative max-w-sm hidden md:block">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full outline-none border border-gray-200 dark:border-gray-800 p-2 pl-10 rounded-3xl dark:bg-gray-900"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className='flex gap-2 md:gap-5 items-center'>
                            <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                                <ShoppingCartOutlinedIcon className="text-xl md:text-2xl text-gray-700 dark:text-white" />
                            </button>

                            <div className="relative hidden md:block">
                                <button className="w-10 h-10 flex items-center justify-center">
                                    <NotificationsNoneIcon className="text-2xl" />
                                </button>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 mt-1 rounded-full">
                                    3
                                </span>
                            </div>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-1 md:p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded flex items-center"
                            >
                                {darkMode ? <LightMode className="text-xl md:text-2xl" /> : <DarkMode className="text-xl md:text-2xl" />}
                            </button>

                            <button
                                className='md:hidden p-1'
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="fixed inset-0  bg-white dark:bg-gray-900 z-10 pt-16">
                            <div className="flex flex-col p-5">
                                <div className="mb-6 mt-7">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full mt-2 outline-none border border-gray-200 dark:border-gray-800 p-3 pl-10 rounded-3xl dark:bg-gray-900"
                                    />
                                    <FaSearch className="absolute left-8 top-[9.1rem] transform -translate-y-1/2 text-gray-500" />
                                </div>

                                <nav>
                                    <ul className="flex flex-col space-y-4">
                                        <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                            <Link className="text-lg font-medium block">Explore</Link>
                                        </li>
                                        <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                            <Link className="text-lg font-medium block">Catagory</Link>
                                        </li>
                                        <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                            <Link className="text-lg font-medium block">About Us</Link>
                                        </li>
                                        <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                            <Link className="text-lg font-medium block">Contact</Link>
                                        </li>
                                    </ul>
                                </nav>

                                <div className="mt-auto pt-6">
                                    <div className="flex items-center space-x-2 p-2 border-b border-gray-100 dark:border-gray-800">
                                        <NotificationsNoneIcon className="text-2xl" />
                                        <span>Notifications</span>
                                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </header>
            </div>

            <div className={`pt-16 md:pt-20 ${mobileMenuOpen ? 'hidden' : 'block'}`}>

                <div className="relative w-full h-64 md:h-96">

                    <img
                        src={bannerImage}
                        alt="Construction Services"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-16">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 max-w-xl">
                            Building Tomorrow With Quality Today
                        </h1>
                        <p className="text-white/90 text-sm sm:text-base md:text-xl mb-4 md:mb-6 max-w-lg">
                            Professional construction services for residential and commercial projects
                        </p>
                        <div className="flex gap-2 md:gap-4">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-3 md:py-3 md:px-6 rounded-md text-sm md:text-base transition-all flex items-center gap-1 md:gap-2">
                                <Wrench size={16} className="md:w-5 md:h-5" />
                                Our Services
                            </button>
                            <button className="bg-transparent hover:bg-white/10 text-white border border-white py-2 px-3 md:py-3 md:px-6 rounded-md text-sm md:text-base transition-all">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header