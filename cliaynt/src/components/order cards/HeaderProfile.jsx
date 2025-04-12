import React, { useEffect, useState } from 'react'
import img from '../order cards/img/wallhaven-83mgq1.jpg'
import { Link } from 'react-router-dom'
import api from '../../api';
import toast from 'react-hot-toast';
import { useCart } from "../CartContext";

function HeaderProfile() {
    // Core state management
    const { cart } = useCart();
    const [paymentStatus, setPaymentStatuses] = useState([])
    const [orderStatus, setOrderStatus] = useState([])
    const [count, setCount] = useState([])
    const [cartOpen, setCartOpen] = useState(false);


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
                        <div>
                            <div>
                                <span>My Account</span>
                            </div>
                            <div>
                                <span>Setting</span>
                            </div>
                        </div>
                        {/* Pending Payments */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">PENDING PAYMENTS</h3> {paymentStatus.filter(c => c.status === 'PENDING').length}
                            </div>
                        </div>

                        {/* Completed Payments */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">COMPLETED PAYMENTS</h3> {paymentStatus.filter(c => c.status === 'COMPLETED').length}
                            </div>
                        </div>


                        {/* Orders Section */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400">RECENT ORDERS</h3> {orderStatus.filter(c => c.status === 'PENDING').length}
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    )
}

export default HeaderProfile
