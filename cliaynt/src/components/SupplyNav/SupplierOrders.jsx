import React, { useEffect, useState } from 'react';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';

function SupplierOrders() {
    // Status badge colors

    const [order, setOrder] = useState([])
    const [statusState, setStatusState] = useState({
        status: ''
    })
    const getStatusBadgeColor = (status) => {
        const statusColors = {
            Completed: "bg-green-100 text-green-800",
            Processing: "bg-blue-100 text-blue-800",
            Pending: "bg-yellow-100 text-yellow-800",
            Cancelled: "bg-red-100 text-red-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    useEffect(() => {

        feaheOrder()
    }, [])

    const feaheOrder = async () => {
        try {
            const result = await api.get('/supplier/get-order')
            if (result.data.status) {
                setOrder(result.data.order)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleStatus = async (newStatus, id) => {
        try {
            const result = await api.put(`/supplier/update-order-status/${id}`, {
                ...statusState,
                status: newStatus
            });
            if (result.data.status) {
                setStatusState({ status: newStatus });
                toast.success(result.data.message);
                feaheOrder();
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
    };


    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Orders</h2>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((c, index) => (
                            <tr
                                key={c.id || index}
                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                <td className="p-3 text-sm text-indigo-600 font-medium">{c.id}</td>
                                <td className="p-3 text-sm text-gray-800">{c.customer.name}</td>
                                <td className="p-3 text-sm text-gray-800">
                                    <span className={` ${c.address && c.address.length > 0}` ? 'bg-green-100 px-2 py-1 rounded-full text-green-800' : 'bg-red-100 px-2 py-1 rounded-full text-green-800'}>
                                        {c.address && c.address.length > 0 ? c.address : 'not delivery'}
                                    </span>
                                </td>

                                <td className="p-3 text-sm text-gray-500">
                                    {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }).replace(' ', '.')}
                                </td>

                                <td className="p-3 text-sm text-gray-800 font-medium">{c.totalPrice}</td>
                                <td className="p-3 text-sm">
                                    <select
                                        value={c.status || "PROCESSING"} // ✅ Ensure default value if undefined
                                        onChange={e => handleStatus(e.target.value, c.id)}
                                        className={`px-2 py-1 rounded-full text-xs font-medium outline-none 
                                        ${c.status === 'PROCESSING' ? 'bg-red-200 text-blue-800' : 'bg-blue-100 text-blue-800'}`}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </td>

                            </tr>
                        ))}
                        {order.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
                {order.map((order, index) => (
                    <div key={order.id || index} className="border rounded-lg overflow-hidden">
                        <div className="p-3 border-b bg-gray-50 flex justify-between">
                            <span className="font-medium text-indigo-600">{order.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="p-3">
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Customer:</span>
                                <span className="text-sm col-span-2">{'order.customer'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Address:</span>
                                <span className="text-sm col-span-2">{order.address}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Date:</span>
                                <span className="text-sm col-span-2">{'order.date'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <span className="text-xs text-gray-500">Total:</span>
                                <span className="text-sm col-span-2 font-medium">{order.totalPrice}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {order.length === 0 && (
                    <div className="text-center p-4 border rounded-lg text-gray-500">
                        No orders found
                    </div>
                )}
            </div>
        </div>
    );
}

export default SupplierOrders;