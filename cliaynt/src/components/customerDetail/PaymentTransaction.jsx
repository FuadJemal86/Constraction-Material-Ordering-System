import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api'

function PaymentTransaction() {
    const {transaction} = useParams()
    const [teansaction , setTransaction] = useState([])

    useEffect(() => {
        const feachTransaction = async() => {
            try {
                const result = await api.get(`/customer/get-transaction/${transaction}`)

                if(result.data.status) {
                    setTransaction(result.data.paymentTransaction)
                } else {
                    console.log(result.data.message)
                }
            } catch(err) {
                console.log(err)
            }
        }
        feachTransaction()
    },[])

    return (
        <div>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bank</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {teansaction.map((trans) => (
                                    <tr key={trans.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{trans.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{trans.product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{trans.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{trans.subtotal}</td>

                                        <td className="px-6 py-4 whitespace-nowrap">{''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default PaymentTransaction
