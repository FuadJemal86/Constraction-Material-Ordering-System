import React from 'react'
import { FaSearch } from "react-icons/fa";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import logo from '../../images/logo constraction.jpeg'
import { LightMode, DarkMode } from "@mui/icons-material";


function Header() {
    return (
        <div>
            <div>
                <header>
                    <div className='flex items-center p-2'>
                        <div className='flex items-center'>
                            
                                <img className='w-16 h-16' src={logo} alt="" srcset="" />
                            
                            <div className='font-bold text-2xl'>
                                <p>ConstracEase</p>
                            </div>
                        </div>

                        <div className='flex justify-center w-full'>
                            <nav>
                                <ul className='flex gap-3 font-semibold'>
                                    <li>Explore</li>
                                    <li>Catagory</li>
                                    <li>About Us</li>
                                    <li>Contact</li>
                                </ul>
                            </nav>
                        </div>

                        <div className="relative max-w-sm">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full outline-none border border-gray-200 p-2 pl-10 pr-4 rounded-3xl"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className='flex gap-5 items-center px-3'>
                            <div>
                                <ShoppingCartOutlinedIcon className="text-3xl text-gray-700" />
                            </div>

                            <div className="relative">
                                <button className="w-10 h-10 flex items-center justify-center   transition duration-300">
                                    <NotificationsNoneIcon className="text-2xl" />
                                </button>
                                {/* Notification Badge */}
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 mt-1 rounded-full">
                                    3
                                </span>
                            </div>

                            <div>
                                <LightMode className="text-2xl"/>
                            </div>

                            <div className='hidde'>
                                <DarkMode className="text-2xl"/>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

        </div>
    )
}

export default Header
