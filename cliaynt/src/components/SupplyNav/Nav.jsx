import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../images/logo constraction.jpeg'
import { AlignLeft, MoreVertical, Eye, Package, ShoppingCart, Box, CreditCard, MessageCircle, AlertCircle, Bell } from "lucide-react";


function Nav() {
    return (
        <div>
            <div className="bg-slate-200/50 backdrop-blur-md shadow-sm fixed right-0 left-64 h-11 flex items-center">
                <header className='w-full'>
                    <div className='flex'>
                        <div className='w-full'>
                            <button className='p-2'>
                                <AlignLeft size={24} />
                            </button>
                        </div>

                        <div className='flex text-right gap-2'>

                            <div className='text-right'>
                                <button className='p-2'>
                                    <MessageCircle size={24} />
                                </button>
                            </div>

                            <div className='text-right'>
                                <button className='p-2'>
                                    <MoreVertical size={24} />
                                </button>
                            </div>
                        </div>

                    </div>
                </header>
            </div>

            <div>
                <div className='bg-gray-900 w-64 h-screen z-[1000] '>
                    <div className='p-2'>
                        <div className='p-4 mt-4 mb-4 border rounded-2xl border-gray-700 flex items-center gap-2'>
                            <span className='bg-white rounded-full'><img className='w-11 h-11' src={logo} alt="" srcset="" /></span>
                            <div className='font-semibold text-gray-200 text-2xl'>Supply Page</div>
                        </div>
                        <nav className='pl-8 pt-7'>
                            <ul className='text-gray-300 grid gap-4 text-left'>
                                <li className='hover:bg-slate-700 hover:text-white w-full p-1 transition cursor-pointer rounded-md flex gap-2'><Eye /><Link className='w-full pl-1'>Overview</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white flex gap-2'><Package /><Link className='w-full pl-1'>Orders</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white flex gap-2'><ShoppingCart /><Link className='w-full pl-1'>Suppliers</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white flex gap-2'><Box /><Link className='w-full pl-1'>Products</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white flex gap-2'><CreditCard /><Link className='w-full pl-1'>Payments</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white flex gap-2'><MessageCircle /><Link className='w-full pl-1'>Messages</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nav
