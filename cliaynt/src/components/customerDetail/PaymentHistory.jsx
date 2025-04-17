import React, { useEffect, useState } from 'react'
import api from '../../api'
import { Link } from 'react-router-dom'

function PaymentHistory() {
    const [paymentHistory, setPaymentHistory] = useState([])
    useEffect(() => {
        const feachPayment = async () => {
            try {
                const result = await api.get('/customer/get-payment')

                if (result.data.status) {
                    setPaymentHistory(result.data.payment)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        feachPayment()
    }, [])
    return (
        <div className='max-w-6xl mx-auto px-4 py-8 pt-24'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold">Payment</h2>
                </div>
                <div className="overflow-x-auto">

                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction Id</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {paymentHistory.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{payment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">birr {payment.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{payment.transactionId}</td>
                                    <td>
                                        <span className="p-3 text-sm text-gray-500">
                                            {new Date(payment.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            }).replace(' ', '.')}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            payment.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/payment-transaction/${payment.transactionId}`} className="text-yellow-500 hover:text-yellow-600 font-medium" >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default PaymentHistory
