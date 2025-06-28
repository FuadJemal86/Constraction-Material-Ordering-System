import React, { useEffect, useState } from 'react'
import api from '../../api';
import { Link } from 'react-router-dom';

function RecentOrder() {

    const [orders, setCustomer] = useState([])
    const [activeTap, setActioveTap] = useState(false)

    useEffect(() => {
        const feachOrder = async () => {
            try {
                const result = await api.get('/customer/get-order')

                if (result.data.status) {
                    setCustomer(result.data.order)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        feachOrder()
    }, [])

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            COMPLETED: "bg-green-100 text-green-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            FAILED: "bg-red-100 text-red-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    }
    return (
        <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">Order History</h2>
                </div>

                <div className="overflow-x-auto">
                    {orders.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{order.supplier.companyName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{order.supplier.phone}</td>
                                        <td className="p-3 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            }).replace(' ', '.')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium outline-none ${getStatusBadgeColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">birr {order.totalPrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Link to={`/order-items/${order.id}`} className="text-yellow-500 hover:text-yellow-600 font-medium" >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
                            <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                                Browse Products
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default RecentOrder
