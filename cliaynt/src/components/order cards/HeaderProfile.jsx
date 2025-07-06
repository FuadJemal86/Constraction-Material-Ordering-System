import React, { useEffect, useState } from 'react'
import img from '../order cards/img/wallhaven-83mgq1.jpg'
import { Link } from 'react-router-dom'
import api from '../../api';
import toast from 'react-hot-toast';
import { useCart } from "../CartContext";
import {
    User,
    Settings,
    Clock,
    CheckCircle,
    Package,
    LogOut
} from "lucide-react";

function HeaderProfile() {
    // Core state management
    const { cart } = useCart();
    const [paymentStatus, setPaymentStatuses] = useState([])
    const [orderStatus, setOrderStatus] = useState([])
    const [count, setCount] = useState([])
    const [cartOpen, setCartOpen] = useState(false);
    const [isProfile, setProfile] = useState(false)
    const [profilePicture, setProfilePicture] = useState()
    const [login, isLogin] = useState(false)


    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);



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
                // toast.error(err.response.data.message)
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
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.error('Error fetching payment statuses:', err);
                // toast.error(err.response?.data?.message || 'Failed to fetch payment statuses');
            }
        };

        fetchStatus();
    }, []);

    useEffect(() => {

        const feachData = async () => {
            try {
                const result = await api.get('/customer/profile')
                if (result.data.status) {
                    setProfile(true)
                    setProfilePicture(result.data.customer)

                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        feachData()

    }, [])

    useEffect(() => {

        const feachData = async () => {
            try {
                const result = await api.get('/customer/verify-token')
                if (result.data.valid) {
                    isLogin(true)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        feachData()

    }, [])

    const handleLogout = async () => {
        try {
            const result = await api.post('/customer/logout')
            window.location.reload()
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div>
            {
                login && (
                    <span className="relative group">
                        {
                            isProfile && (
                                profilePicture?.image?.length > 0 ? (
                                    <button className="h-8 w-8  border border-gray-500  rounded-full overflow-hidden">
                                        <img src={`${api.defaults.baseURL}/images/${profilePicture?.image}`} alt="Profile picture" className="w-full h-full object-cover p-[2px] rounded-full" />
                                    </button>

                                ) : (
                                    <button className="h-8 w-8   rounded-full overflow-hidden">
                                        <User />
                                    </button>
                                )
                            )
                        }
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                            <div className="p-4">
                                <div className='mb-2'>
                                    <Link to={'/my-account'} className='flex items-center justify-between mb-2 hover:bg-slate-400 py-1 px-1 w-full rounded-md hover:text-white transition-colors dark:hover:bg-slate-900'>
                                        <span className='p-1'>
                                            <User />
                                        </span>
                                        <span className='font-semibold text-sm text-gray-500 dark:text-white px-1 py-2 w-full hover:text-white '>My Account</span>
                                    </Link>
                                </div>

                                <div className="mb-2">
                                    <Link to={'/my-account'} className="flex items-center justify-between mb-2 hover:bg-slate-400 py-1 px-1 w-full rounded-md hover:text-white transition-colors dark:hover:bg-slate-900">
                                        <span className='p-1'>
                                            <Clock />
                                        </span>
                                        <span className="font-semibold text-sm text-gray-500 dark:text-white px-1 py-2 w-full hover:text-white  ">pending payment</span> {paymentStatus.filter(c => c.status === 'PENDING').length}
                                    </Link>
                                </div>

                                <div className="mb-2">
                                    <Link to={'/my-account'} className="flex items-center justify-between mb-2 hover:bg-slate-400 py-1 px-1 w-full rounded-md hover:text-white transition-colors dark:hover:bg-slate-900">
                                        <span className='p-1'>
                                            <CheckCircle />
                                        </span>
                                        <span className="font-semibold text-sm text-gray-500 dark:text-white px-1 py-2 w-full hover:text-white">completed payment</span> {paymentStatus.filter(c => c.status === 'COMPLETED').length}
                                    </Link>
                                </div>

                                <div>
                                    <Link to={'/my-account'} className="flex items-center justify-between mb-2 hover:bg-slate-400 py-1 px-1 w-full rounded-md hover:text-white transition-colors dark:hover:bg-slate-900">
                                        <span className='p-1'>
                                            <Package />
                                        </span>
                                        <span className="font-semibold text-sm text-gray-500 dark:text-white px-1 py-2 w-full hover:text-white">recent order</span> {orderStatus.filter(c => c.status === 'PENDING').length}
                                    </Link>
                                </div>
                                <Link onClick={handleLogout} className='flex items-center justify-between mb-2 hover:bg-slate-400 py-1 px-1 w-full rounded-md hover:text-white transition-colors dark:hover:bg-slate-900'>
                                    <span className='p-1'>
                                        <LogOut />
                                    </span>
                                    <span className='font-semibold text-sm text-gray-500 dark:text-white px-1 py-2 w-full hover:text-white'>Logout</span>
                                </Link>
                            </div>
                        </div>
                    </span>
                )
            }
        </div>
    )
}

export default HeaderProfile
