import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';

function Payment() {

    const [paymentStatus, setPaymentStatus] = useState([])
    const [status, setStatus] = useState({
        status: ''
    })


    useEffect(() => {

        feachPayment()

    }, [])

    const feachPayment = async () => {
        try {
            const result = await api.get('/supplier/get-payment')

            if (result.data.status) {
                setPaymentStatus(result.data.payments)
                console.log(result.data.payments)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleStatus = async (newStatus, id) => {
        try {
            const result = await api.put(`/supplier/update-payment-status/${id}`, {
                ...status,
                status: newStatus
            })

            if (result.data.status) {
                setStatus({ status: newStatus })
                feachPayment()
                toast.success(result.data.message)

            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }


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
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment</h2>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Transaction</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentStatus.map((c, index) => (
                            <tr
                                key={c.id || index}
                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                <td className="p-3 text-sm text-indigo-600 font-medium">{c.id}</td>
                                <td className="p-3 text-sm text-gray-800">{c.customer.name}</td>
                                <td className="p-3 text-sm text-gray-800">{c.amount} birr</td>
                                <td className="p-3 text-sm text-gray-800">{c.bankTransactionId}</td>
                                <td className="p-3 text-sm text-gray-800">{c.customer.phone}</td>
                                <td className="p-3 text-sm text-gray-500">
                                    {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }).replace(' ', '.')}
                                </td>
                                <td className="p-3 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium outline-none ${getStatusBadgeColor(c.status)}`}>
                                        {c.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {paymentStatus.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500">
                                    No product found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
                {paymentStatus.map((c, index) => (
                    <div key={c.id || index} className="border rounded-lg overflow-hidden">
                        <div className="p-3 border-b bg-gray-50 flex justify-between">
                            <span className="font-medium text-indigo-600">{c.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(c.status)}`}>
                                {c.status}
                            </span>
                        </div>
                        <div className="p-3">
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Customer:</span>
                                <span className="text-sm col-span-2">{c.customer.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Price:</span>
                                <span className="text-sm col-span-2">{c.amount}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Bank Transaction:</span>
                                <span className="text-sm col-span-2">{c.bankTransactionId}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <span className="text-xs text-gray-500">Phone:</span>
                                <span className="text-sm col-span-2 font-medium">{c.customer.phone}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <span className="text-xs text-gray-500">Date:</span>
                                <span className="p-3 text-sm text-gray-500">
                                    {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }).replace(' ', '.')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {paymentStatus.length === 0 && (
                    <div className="text-center p-4 border rounded-lg text-gray-500">
                        No orders found
                    </div>
                )}
            </div>
        </div>
    )
}

export default Payment
