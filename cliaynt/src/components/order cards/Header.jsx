import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { LightMode, DarkMode } from "@mui/icons-material";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from "../CartContext";
import logo from '../../images/logo constraction.jpeg';
import bannerImage from '../../images/banner2 page2.jpg';
import ShoppingCart from './ShoppingCart';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';


function Header() {
    // Core state management
    const { cart } = useCart();
    const [mobilePaymentsOpen, setMobilePaymentsOpen] = useState(false)
    const [mobileOrdersOpen, setMobileOrdersOpen] = useState(false)
    const [paymentStatus, setPaymentStatuses] = useState([])
    const [orderStatus, setOrderStatus] = useState([])
    const [count, setCount] = useState([])
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [cartOpen, setCartOpen] = useState(false);


    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);


    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);



    useEffect(() => {
        document.body.style.overflow = cartOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [cartOpen]);


    useEffect(() => {
        const feachTransitionId = async () => {
            try {
                const result = await api.get('/customer/get-transitionId')

                if (result.data.status) {
                    setCount(result.data.count)
                } else {
                    toast.error(result.data.message)
                }
            } catch (err) {
                toast.error(err.response.data.message)
            }
        }

        feachTransitionId()

    }, [])

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const result = await api.get('/customer/get-payment-status');

                if (result.data.status) {
                    // console.log('Payment statuses:', result.data.paymentStatuses);
                    setPaymentStatuses(result.data.paymentStatuses);
                    setOrderStatus(result.data.orders)
                    console.log(result.data.orders)
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.error('Error fetching payment statuses:', err);
                toast.error(err.response?.data?.message || 'Failed to fetch payment statuses');
            }
        };

        fetchStatus();
    }, []);






    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <header className="relative">
                <div className='flex items-center justify-between md:p-2 p-1 fixed right-0 left-0 top-0 bg-white dark:bg-gray-900 z-20 shadow-md'>

                    <div className='flex items-center'>
                        <img className='w-11 h-11 md:w-16 md:h-16 dark:bg-white rounded-full' src={logo} alt="ConstracEase Logo" />
                        <div className='font-bold text-lg md:text-2xl md:px-2'>
                            <p>ConstracEase</p>
                        </div>
                    </div>

                    <div className='hidden md:flex justify-center w-full'>
                        <nav>
                            <ul className='flex gap-6 font-semibold'>
                                <li><Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link></li>
                                <li><Link to="/category" className="hover:text-yellow-500 transition-colors">Category</Link></li>
                                <li><Link to="/about" className="hover:text-yellow-500 transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-yellow-500 transition-colors">Contact</Link></li>
                                <li className="relative group">
                                    <button className="hover:text-yellow-500 transition-colors flex items-center">
                                        Payments
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-30">
                                        <div className="p-4">
                                            {/* Pending Payments */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">PENDING PAYMENTS</h3>
                                                    {
                                                        paymentStatus.filter(c => c.status === 'PENDING').length > 2 && (
                                                            <Link to="/payments/pending" className="text-xs text-yellow-500 hover:underline">View All</Link>
                                                        )
                                                    }
                                                </div>

                                                <div className="space-y-2">
                                                    {
                                                        paymentStatus
                                                            .filter(c => c.status === 'PENDING')
                                                            .map(c => (
                                                                <div key={c.id} className="bg-yellow-50 dark:bg-gray-700 p-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                                                    <div className="flex justify-between mb-1">
                                                                        <span className="font-medium text-sm">{c.status}</span>
                                                                        <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">birr {c.totalPrice}</span>
                                                                    </div>
                                                                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">Due in 3 days</div>
                                                                </div>
                                                            ))
                                                    }
                                                </div>
                                            </div>

                                            {/* Completed Payments */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">COMPLETED PAYMENTS</h3>
                                                    {
                                                        paymentStatus.filter(c => c.status === 'COMPLETED').length > 2 && (
                                                            <Link to="/payments/completed" className="text-xs text-green-500 hover:underline">View All</Link>
                                                        )
                                                    }
                                                </div>

                                                <div className="space-y-2">
                                                    {
                                                        paymentStatus
                                                            .filter(c => c.status === 'COMPLETED')
                                                            .map(c => (
                                                                <div key={c.id} className="bg-green-50 dark:bg-gray-700 p-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                                                    <div className="flex justify-between">
                                                                        <span className="font-medium text-sm">{c.status}</span>
                                                                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">birr {c.totalPrice}</span>
                                                                    </div>
                                                                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">Paid on Apr 1</div>
                                                                </div>
                                                            ))
                                                    }
                                                </div>

                                            </div>


                                            {/* Orders Section */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">RECENT ORDERS</h3>
                                                    {
                                                        orderStatus.filter(c => c.status).length > 2 && (
                                                            <Link to="/orders" className="text-xs text-yellow-500 hover:underline">View All</Link>
                                                        )
                                                    }
                                                </div>
                                                <div className="space-y-2">
                                                    {
                                                        orderStatus.slice(0, 2).map(c => (
                                                            <div className="bg-blue-50 dark:bg-gray-700 p-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                                                <div className="flex justify-between">
                                                                    <span className="font-medium text-sm">Order {c.id}</span>
                                                                    <span className={`text-blue-600 dark:text-blue-400 text-sm font-medium ${c.status === 'PENDING' ? 'text-yellow-600 ' : null}`}>{c.status}</span>
                                                                </div>
                                                                <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">Placed on Apr 2</div>
                                                            </div>
                                                        ))
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <div>
                                    {count > 0 && (
                                        <Link to="/orders" className="group flex items-center">
                                            <span className="text-sm md:text-base font-medium mr-1.5 transition-colors group-hover:text-yellow-500">Orders</span>
                                            <span className="flex items-center justify-center h-6 w-6 md:h-7 md:w-7 bg-yellow-500 text-white text-xs md:text-sm font-bold rounded-full transform transition-transform group-hover:scale-110">
                                                {count}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </ul>
                        </nav>
                    </div>

                    {/* Desktop Search */}
                    <div className="relative max-w-sm hidden md:block">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full outline-none border border-gray-200 dark:border-gray-800 p-2 pl-10 rounded-3xl dark:bg-gray-900"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>

                    {/* Header Icons */}
                    <div className='flex gap-2 md:gap-5 items-center'>
                        {/* Payments Quick Access */}
                        <div className="relative hidden md:block">

                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-30 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">Payment Summary</h3>
                                        <Link to="/dashboard/payments" className="text-yellow-500 hover:underline text-sm">Full Dashboard</Link>
                                    </div>

                                    {/* Payment Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {
                                            paymentStatus.filter(c => c.status === 'PENDING').map(c => (
                                                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{c.status}</div>
                                                    <div className="flex items-end justify-between">
                                                        <span className="text-lg font-bold">$5,640</span>
                                                        <span className="text-green-500 text-sm">7 invoices</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Orders Quick Access */}
                        <div className="relative hidden md:block">
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-30 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">Orders</h3>
                                        <Link to="/orders" className="text-yellow-500 hover:underline text-sm">View All Orders</Link>
                                    </div>

                                    {/* Orders Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {
                                            orderStatus.slice(0, 2).map(c => (
                                                <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow text-center">
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{c.status}</div>
                                                    <div className="text-purple-500 font-bold">{c.length}</div>
                                                </div>

                                            ))
                                        }
                                    </div>

                                    {/* Recent Orders */}
                                    <div className="space-y-2">
                                        {
                                            orderStatus.slice(0, 2).map(c => (
                                                <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="font-medium">Order #2045</div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">Apr 2, 2025</div>
                                                        </div>
                                                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">{c.status}</div>
                                                    </div>
                                                </div>

                                            ))
                                        }

                                    </div>

                                    {/* Track Order Button */}
                                    <button className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium transition-colors">
                                        Track Current Order
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cart Icon */}
                        <button
                            className="relative hidden md:block"
                            onClick={() => setCartOpen(true)}
                        >
                            <div className="w-10 h-10 flex items-center justify-center">
                                <ShoppingCartOutlinedIcon className="text-2xl" />
                            </div>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        {/* Notification Icon */}
                        <div className="relative hidden md:block">
                            <button className="w-10 h-10 flex items-center justify-center">
                                <NotificationsNoneIcon className="text-2xl" />
                            </button>
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                3
                            </span>
                        </div>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-1 md:p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded flex items-center"
                        >
                            {darkMode ? <LightMode className="text-xl md:text-2xl" /> : <DarkMode className="text-xl md:text-2xl" />}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className='md:hidden p-1'
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="fixed top-0 inset-0 bg-white dark:bg-gray-900 z-10 pt-16">
                        <div className="flex flex-col p-5">


                            {/* Mobile Navigation */}
                            <nav>
                                <ul className="flex flex-col space-y-4">
                                    <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                        <Link to="/" className="text-lg font-medium block">Explore</Link>
                                    </li>
                                    <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                        <Link to="/category" className="text-lg font-medium block">Category</Link>
                                    </li>
                                    <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                        <Link to="/about" className="text-lg font-medium block">About Us</Link>
                                    </li>
                                    <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                        <Link to="/contact" className="text-lg font-medium block">Contact</Link>
                                    </li>

                                    {/* Payments Section */}
                                    <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between items-center" onClick={() => setMobilePaymentsOpen(!mobilePaymentsOpen)}>
                                            <span className="text-lg font-medium">Payments</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${mobilePaymentsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        {/* Mobile Payments Dropdown */}
                                        {mobilePaymentsOpen && (
                                            <div className="mt-3 pl-4 space-y-3">
                                                {/* Pending Payments */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">PENDING PAYMENTS</h3>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {
                                                            paymentStatus.slice(0, 2).filter(c => c.status === 'PENDING').map(c => (
                                                                <div className="bg-yellow-50 dark:bg-gray-700 p-2 rounded-lg hover:shadow-md transition-shadow">
                                                                    <div className="flex justify-between">
                                                                        <span className="font-medium text-sm">payment {c.id}</span>
                                                                        <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">{c.status}</span>
                                                                    </div>
                                                                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">Due in 3 days</div>
                                                                </div>
                                                            ))
                                                        }

                                                    </div>
                                                    <div className="mt-2">
                                                        <Link to="/payments/pending" className="text-sm text-yellow-500 hover:underline">View All Pending</Link>
                                                    </div>
                                                </div>

                                                {/* Divider */}
                                                <div className="border-t border-gray-100 dark:border-gray-800 my-3"></div>

                                                {/* Completed Payments */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">COMPLETED PAYMENTS</h3>
                                                    </div>
                                                    {
                                                        paymentStatus.slice(0, 2).filter(c => c.status === 'COMPLETED').map(c => (
                                                            <div className="space-y-2">
                                                                <div className="bg-green-50 dark:bg-gray-700 p-2 rounded-lg hover:shadow-md transition-shadow">
                                                                    <div className="flex justify-between">
                                                                        <span className="font-medium text-sm">Invoice #1078</span>
                                                                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">$2,350</span>
                                                                    </div>
                                                                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">{c.status}</div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }

                                                    <div className="mt-2">
                                                        <Link to="/payments/completed" className="text-sm text-yellow-500 hover:underline">View All Completed</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </li>

                                    {/* Orders Section */}
                                    <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between items-center" onClick={() => setMobileOrdersOpen(!mobileOrdersOpen)}>
                                            <span className="text-lg font-medium">Orders</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${mobileOrdersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        {/* Mobile Orders Dropdown */}
                                        {mobileOrdersOpen && (
                                            <div className="mt-3 pl-4 space-y-3">

                                                {
                                                    orderStatus.slice(0, 2).map(c => (
                                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                                            <div className="bg-white dark:bg-gray-700 py-2 rounded-lg shadow text-center">
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">{c.status}</div>
                                                                <div className="text-blue-500 font-bold">{c.length}</div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }

                                                {/* Recent Orders */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">RECENT ORDERS</h3>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {
                                                            orderStatus.slice(0, 2).map(c => (
                                                                <div className="bg-blue-50 dark:bg-gray-700 p-2 rounded-lg">
                                                                    <div className="flex justify-between items-center">
                                                                        <div>
                                                                            <div className="font-medium text-sm">Order {c.id}</div>
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{c.totalPrice}</div>
                                                                        </div>
                                                                        <div className="text-blue-600 dark:text-blue-400 text-xs font-medium">{c.status}</div>
                                                                    </div>
                                                                </div>

                                                            ))
                                                        }
                                                    </div>
                                                    <div className="mt-2">
                                                        <Link to="/orders" className="text-sm text-yellow-500 hover:underline">View All Orders</Link>
                                                    </div>
                                                </div>

                                                {/* Track Order Button */}
                                                <button className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                                    Track Current Order
                                                </button>
                                            </div>
                                        )}
                                    </li>

                                    <div>
                                        {count > 0 && (
                                            <Link to="/orders" className="group flex items-center">
                                                <span className="text-sm md:text-base font-medium mr-1.5 transition-colors group-hover:text-yellow-500">Orders</span>
                                                <span className="flex items-center justify-center h-6 w-6 md:h-7 md:w-7 bg-yellow-500 text-white text-xs md:text-sm font-bold rounded-full transform transition-transform group-hover:scale-110">
                                                    {count}
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                </ul>
                            </nav>

                            {/* Mobile Bottom Actions */}
                            <div className="mt-auto relative pt-6">
                                {/* Payment Stats for Mobile */}
                                <div className="mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">PAYMENT SUMMARY</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {
                                            paymentStatus.slice(0, 2).map(c => (
                                                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{c.status}</div>
                                                    <div className="flex items-end justify-between">
                                                        <span className="text-lg font-bold">{c.totalPrice}</span>
                                                        <span className="text-yellow-500 text-sm">{c.length}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 p-2 border-b border-gray-100 dark:border-gray-800">
                                    <NotificationsNoneIcon className="text-2xl" />
                                    <span>Notifications</span>
                                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
                                </div>

                                <div
                                    className="flex items-center space-x-2 p-2 border-b border-gray-100 dark:border-gray-800 cursor-pointer"
                                    onClick={() => setCartOpen(true)}
                                >
                                    <ShoppingCartOutlinedIcon className="text-2xl" />
                                    <span>Cart</span>
                                    {cartItemCount > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shopping Cart Modal */}
                {cartOpen && <ShoppingCart onClose={() => setCartOpen(false)} />}
            </header>

            {/* Banner Section */}
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
                                <span className="md:w-5 md:h-5">🔧</span>
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
    );
}

export default Header;