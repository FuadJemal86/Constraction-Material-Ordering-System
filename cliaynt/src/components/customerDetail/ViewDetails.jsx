import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api'
import customerValidation from '../../hookes/customerValidation'

function ViewDetails() {
    customerValidation()
    const { id } = useParams()
    const [orderItem, setOrderItem] = useState([])

    useEffect(() => {
        const feachOrderItem = async () => {
            try {
                const result = await api.get(`/customer/get-order-item/${id}`)
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
    }, [])
    return (
        <div className='max-w-6xl mx-auto px-4 py-8 pt-24'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">Order item</h2>
                </div>
                <div className="overflow-x-auto">

                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {orderItem.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{order.product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{order.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{order.unitPrice}/{order.product.unit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{order.subtotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default ViewDetails
