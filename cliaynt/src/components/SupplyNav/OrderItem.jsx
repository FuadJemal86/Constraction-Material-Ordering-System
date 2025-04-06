import React, { useEffect, useState } from 'react'
import api from '../../api';
import { Link } from 'react-router-dom';

function OrderItem() {

    const [orderItem, setOrderItem] = useState([])

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            Completed: "bg-green-100 text-green-800",
            Processing: "bg-blue-100 text-blue-800",
            Pending: "bg-yellow-100 text-yellow-800",
            Cancelled: "bg-red-100 text-red-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    }

    useEffect(() => {
        const feachOrderItem = async () => {
            try {
                const result = await api.get('/supplier/get-order-item')

                if (result.data.status) {
                    setOrderItem(result.data.orderItem)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        feachOrderItem()
    },[])

    return (
        <div>
            <div className="p-4 mt-16 bg-white rounded-lg shadow ">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Product</h2>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <div className='flex justify-end '>
                        <Link to={'/supplier-page/add-product'} className='bg-blue-950 p-2 mb-2 rounded-lg text-gray-300'>Post Product</Link>
                    </div>
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItem.map((order, index) => (
                                <tr
                                    key={order.id || index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="p-3 text-sm text-indigo-600 font-medium">{order.id}</td>
                                    <td className="p-3 text-sm text-gray-800">{order.product.name}</td>
                                    
                                    <td className="p-3 text-sm text-gray-500">{order.subTotal}</td>
                                    <td className="p-3 text-sm text-gray-800"></td>
                                </tr>
                            ))}
                            {orderItem.length === 0 && (
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
                    {orderItem.map((order, index) => (
                        <div key={order.id || index} className="border rounded-lg overflow-hidden">
                            <div className="p-3 border-b bg-gray-50 flex justify-between">
                                <span className="font-medium text-indigo-600">{order.id}</span>
                            </div>
                            <div className="p-3">
                                <div className="grid grid-cols-3 gap-1 mb-2">
                                    <span className="text-xs text-gray-500">Customer:</span>
                                    <span className="text-sm col-span-2">{order.product.name}</span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-xs text-gray-500">Total:</span>
                                    <span className="text-sm col-span-2 font-medium">{order.subTotal}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {orderItem.length === 0 && (
                        <div className="text-center p-4 border rounded-lg text-gray-500">
                            No orders found
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default OrderItem
