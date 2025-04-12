import React, { useEffect, useState } from 'react'
import img from '../order cards/img/wallhaven-83mgq1.jpg'
import { Link } from 'react-router-dom'
import api from '../../api';
import toast from 'react-hot-toast';
import { useCart } from "../CartContext";

function HeaderProfile() {
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
            <span className="relative group">
                <button className="h-8 w-8  border border-gray-500  rounded-full overflow-hidden">
                    <img src={img} alt="Profile picture" className="w-full h-full object-cover p-[2px] rounded-full" />
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
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
            </span>
        </div>
    )
}

export default HeaderProfile
