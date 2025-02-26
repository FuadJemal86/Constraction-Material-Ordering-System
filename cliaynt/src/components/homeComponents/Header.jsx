import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <div>
            <div className=' bg-transparent'>
                <div className='w-full fixed top-0 bg-white shadow-sm backdrop-blur-2xl'>
                    <nav>
                        <ul >
                            <div className='flex p-3 '>
                                <div className='flex w-full space-x-7 px-14 font-semibold'>
                                    <li><Link>Logo</Link></li>
                                    <li className='hidden md:block'><Link>Home Page</Link></li>
                                    <li className='hidden md:block'><Link>About Us</Link></li>
                                    <li className='hidden md:block'><Link>Contact Us</Link></li>
                                    <li className='hidden md:block'><Link>Service</Link></li>
                                </div>

                                <div className='flex justify-end  space-x-7 '>
                                    <div className='border  rounded-full hover:bg-slate-200 hidden md:block'>
                                        <button className='px-4 py-1 font-medium'>Join</button>
                                    </div>
                                    <div className='border rounded-full  hidden md:block bg-fuchsia-500 text-white text-center'>
                                        <button className='px-4 py-1 font-medium '>Learn</button>
                                    </div>

                                    <div className='border rounded-lg  hover:bg-slate-200 block md:hidden text-center'>
                                        <button className='px-4 py-1'>Nav</button>
                                    </div>
                                </div>
                            </div>
                        </ul>
                    </nav>
                </div>
            </div>

        </div>
    )
}

export default Header
