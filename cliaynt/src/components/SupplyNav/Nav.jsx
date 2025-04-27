import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../../images/logo constraction.jpeg';
import toast from 'react-hot-toast';
import {
    Menu, X, ChevronLeft, Eye, Package, Box,
    CreditCard, MessageCircle, MoreVertical, Bell, Search, User, PlayCircle, StopCircle
} from "lucide-react";
import api from '../../api';

function Nav() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isOnline, setOnline] = useState()
    const [isVerifiy, setVerifay] = useState()
    const location = useLocation();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { icon: <Eye size={20} />, title: 'Overview', path: '/' },
        { icon: <Package size={20} />, title: 'Orders', path: '/supplier-page/order' },
        { icon: <CreditCard size={20} />, title: 'Payments', path: '/supplier-page/payment' },
        { icon: <Box size={20} />, title: 'Products', path: '/supplier-page/product' },
        isOnline ? (
            { icon: <StopCircle size={20} />, title: 'Stop', path: '' }

        ) : (
            { icon: <PlayCircle size={20} />, title: 'Start', path: '' }
        )
    ];

    useEffect(() => {
        const chekVerify = async () => {
            try {
                const result = await api.get('/supplier/is-verify')

                if (result.data.status) {
                    setVerifay(result.data.supplierVerifiy)
                    setOnline(result.data.chekOnline)

                } else {
                    toast.error(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        chekVerify()
    }, [])


    return (
        <div className="flex flex-col h-screen lg:flex-row min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className=" fixed inset-0 z-20 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}


            {/* Sidebar */}
            <aside className={`
                fixed lg:static top-0 left-0
                h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out
                ${collapsed ? 'w-20' : 'w-64'}
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo section */}
                <div className="p-4 flex flex-row items-center">
                    <div className={`
                        rounded-xl  
                        flex items-center   ${collapsed ? 'justify-center' : 'gap-3'}
                    `}>
                        <span className="bg-white rounded-full flex-shrink-0">
                            <img className="w-10 h-10 rounded-full" src={logo} alt="Logo" />
                        </span>
                        {!collapsed && (
                            <div className="font-medium text-gray-100 text-xl">Supply Panel</div>
                        )}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-400 hover:text-white hidden lg:block ml-4"
                    >
                        <ChevronLeft size={20} className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className='mt-6'>
                    <ul className={`
                        text-gray-300 space-y-2 px-2
                        ${collapsed ? 'flex flex-col items-center' : ''}
                    `}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path} className="w-full">
                                    <Link
                                        to={item.path}
                                        className={`
                                            flex items-center py-3 px-3 rounded-lg transition-colors
                                            ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                                            ${collapsed ? 'justify-center' : ''}
                                        `}
                                    >
                                        <span className="inline-flex">{item.icon}</span>
                                        {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <div className='flex flex-1 flex-col'>
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0  z-30">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center">
                            <button
                                onClick={toggleMobileSidebar}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none lg:hidden"
                            >
                                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <div className="ml-2 lg:ml-6 relative text-gray-500 focus-within:text-gray-900 hidden md:block">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {
                                !isVerifiy ? (
                                    <Link to={'/supplier-verification'} className="px-2 py-1 bg-red-100 text-red-800 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                        Unverifiy
                                    </Link>
                                ) : (
                                    <Link className="px-2 py-1 bg-green-100 text-green-800 rounded-full hover:bg-gray-100">
                                        verifiyed
                                    </Link>
                                )
                            }

                            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <MessageCircle size={20} />
                            </button>
                            <div className="relative">
                                <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                            <div className="ml-2 hidden sm:block">
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <User size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">

                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Nav;