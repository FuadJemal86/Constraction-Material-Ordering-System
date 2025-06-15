import React, { useEffect, useState, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../../images/logo constraction.jpeg';
import toast from 'react-hot-toast';
import {
    Menu, X, ChevronLeft, ChevronRight, Eye, Package, Box,
    CreditCard, MessageCircle, MoreVertical, Bell, Search, User, PlayCircle, StopCircle, Globe, Trash2,
    Settings
} from "lucide-react";
import api from '../../api';


function Nav() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isOnline, setOnline] = useState(true);
    const [isVerifiy, setVerifay] = useState();
    const [supplierImage, setSupplierImage] = useState({})
    const location = useLocation();


    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen);
    };

    const stopSupplier = async () => {
        try {
            const result = await api.put('/supplier/offline')
            if (result.data.status) {
                setOnline(result.data.onlineStatus)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const startSupplier = async () => {
        try {
            const result = await api.put('/supplier/online');
            if (result.data.status) {
                setOnline(result.data.onlineStatus);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            startSupplier();
        } else {
            stopSupplier();
        }
    };

    useEffect(() => {

        startSupplier();

        // Add visibility change event listener
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const pingInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {

                api.put('/supplier/online').catch(err => console.log(err));
            }
        }, 30000);

        return () => {
            stopSupplier();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(pingInterval);
        };
    }, []);

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


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await api.get('/supplier/supplier-profile')
                if (result.data.status) {
                    setSupplierImage(result.data.supplierImage)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchProfile()
    }, [])

    const menuItems = useMemo(() => [
        { icon: <Eye size={20} />, title: 'Overview', path: '/' },
        { icon: <Package size={20} />, title: 'Orders', path: '/supplier-page/order' },
        {
            icon: <CreditCard size={20} />, title: 'Payments', path: '/supplier-page/payment',
            Chevron: <ChevronRight size={20} />,
            subMenu: [
                { icone: <Globe />, title: 'Completed', path: '/supplier-page/done-payment' },
            ]
        },
        { icon: <Box size={20} />, title: 'Products', path: '/supplier-page/product' },
        isOnline
            ? { icon: <StopCircle size={20} />, title: 'Stop', onClick: stopSupplier }
            : { icon: <PlayCircle size={20} />, title: 'Start', onClick: startSupplier },

    ], [isOnline]);

    const [openSubMenus, setOpenSubMenus] = useState({});

    const toggleSubMenu = (title) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <div className="flex flex-col h-screen lg:flex-row min-h-screen bg-gray-50">
            {/* Mobile overlay */}



            {/* Sidebar */}
            <aside className={`
                fixed lg:static top-0 left-0
                h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out
                ${collapsed ? 'w-24' : 'w-64'}
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
                <nav className="mt-6 ">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const isSubMenuOpen = openSubMenus[item.title];

                            return (
                                <li key={item.path} className="w-full">

                                    <Link
                                        to={item.path}
                                        className={`
                                        flex items-center justify-between py-3 px-3 rounded-lg transition-colors
                                        ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                                    `}
                                    >
                                        <div className="flex items-center">
                                            <span className="inline-flex">{item.icon}</span>
                                            {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                                        </div>

                                        {/* Arrow Icon */}
                                        {!collapsed && item.Chevron && (
                                            <span className={`ml-auto transform transition-transform ${isSubMenuOpen ? 'rotate-90' : ''}`} onClick={item.subMenu ? () => toggleSubMenu(item.title) : undefined} >
                                                {item.Chevron}
                                            </span>
                                        )}
                                    </Link>

                                    {/* If item has subMenu */}
                                    {item.subMenu && !collapsed && (
                                        <ul className={`ml-8 mt-1 space-y-1 ${!isSubMenuOpen ? 'hidden' : ''}`}>
                                            {item.subMenu.map((subItem) => {
                                                const isSubActive = location.pathname === subItem.path;
                                                return (
                                                    <li key={subItem.path}>
                                                        <Link
                                                            to={subItem.path}
                                                            className={`
                                                                    block py-2 px-3 rounded-lg text-sm transition-colors
                                                                ${isSubActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                                                                `}
                                                        >
                                                            <div className='flex items-center'>
                                                                <span className="inline-flex mr-2 h-5 w-5 items-center">{subItem.icone}</span>
                                                                <span>{subItem.title}</span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <div className='flex-1 flex flex-col'>
                {/* Header */}
                <header className="bg-white shadow-sm z-10 sticky top-0">
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
                            {/* Status indicator */}
                            <div className="px-2 py-1 rounded-full flex items-center space-x-1">
                                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                            </div>

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

                            <Link to={'/chat'} className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <MessageCircle size={20} />
                            </Link>
                            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <Link to={'/setting'}>
                                    <Settings size={20} />
                                </Link>
                            </button>
                            <div className="ml-2 hidden sm:block">
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    {
                                        supplierImage?.image ? (
                                            <div className="h-8 w-8 rounded-full  flex items-center justify-center text-white">
                                                <span className="font-medium text-sm "><img className='rounded-full h-8 w-8' src={`http://localhost:3032/images/${supplierImage.image}`} alt="" srcset="" /></span>
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                <span className="font-medium text-sm">S</span>
                                            </div>
                                        )
                                    }
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