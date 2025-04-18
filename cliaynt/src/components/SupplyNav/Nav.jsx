import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import logo from '../../images/logo constraction.jpeg';
import { AlignLeft, MoreVertical, Eye, Package, ShoppingCart, Box, CreditCard, MessageCircle, Bell } from "lucide-react";

function Nav() {
    return (
        <div className='flex'>
            <div className='bg-gray-900 w-64 h-screen fixed left-0 top-0 z-[1000]'>
                <div className='p-2'>
                    <div className='p-4 mt-4 mb-4 border rounded-2xl border-gray-700 flex items-center gap-2'>
                        <span className='bg-white rounded-full'><img className='w-11 h-11' src={logo} alt="Logo" /></span>
                        <div className='font-semibold text-gray-200 text-2xl'>Supply Page</div>
                    </div>
                    <nav className='pl-8 pt-7'>
                        <ul className='text-gray-300 grid gap-4 text-left'>
                            <li className='hover:bg-slate-700 hover:text-white w-full p-1 transition cursor-pointer rounded-md flex gap-2'>
                                <Eye /><Link className='w-full pl-1'>Overview</Link>
                            </li>
                            <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white flex gap-2'>
                                <Package /><Link to={'order'} className='w-full pl-1'>Orders</Link>
                            </li>
                            <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white flex gap-2'>
                                <Box /><Link to={'product'} className='w-full pl-1'>Products</Link>
                            </li>
                            <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white flex gap-2'>
                                <CreditCard /><Link to={'payment'} className='w-full pl-1'>Payments</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className='flex-1 ml-64 flex flex-col min-h-screen'>

                <div className="bg-slate-200/50 backdrop-blur-md shadow-sm h-11 flex items-center sticky top-0 z-50">
                    <header className='w-full'>
                        <div className='flex justify-between px-4'>
                            <div>
                                <button className='p-2'>
                                    <AlignLeft size={24} />
                                </button>
                            </div>

                            <div className='flex gap-2'>
                                <div>
                                    <button className='p-2'>
                                        <MessageCircle size={24} />
                                    </button>
                                </div>

                                <div>
                                    <button className='p-2'>
                                        <MoreVertical size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                <div className="flex-1 p-4 custom-scrollbar bg-gray-50">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Nav;