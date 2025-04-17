import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

function PaymentTransaction() {
    const { transactionId } = useParams();
    const [payment, setPayment] = useState([]);
    const [transactions, setTransaction] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const result = await api.get(`/customer/get-transaction/${transactionId}`);

                if (result.data.status) {
                    setPayment(result.data.paymentTransaction);
                    setTransaction(result.data.transactionId);
                } else {
                    console.log(result.data.message);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [transactionId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-lg">Loading...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen pt-20 pb-8 px-4">
            <div className="max-w-md mx-auto bg-white shadow-md print:shadow-none">
                {/* Print Button - Outside Receipt */}
                <div className="flex justify-end mb-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-gray-800 text-white rounded text-base"
                    >
                        Print Receipt
                    </button>
                </div>

                {/* Receipt Content */}
                <div className="p-6">
                    {payment.length > 0 && (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="font-bold text-2xl">RECEIPT</h2>
                                <p className="text-base mt-1">Transaction #{transactions}</p>
                            </div>

                            <div className="text-base mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Date:</span>
                                    <span>{new Date(payment[0]?.order?.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Customer:</span>
                                    <span>{payment[0]?.order?.customer?.name}</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed my-4"></div>

                            <div className="flex text-base font-medium pb-2">
                                <span className="w-1/2">Item</span>
                                <span className="w-1/6 text-center">Quantity</span>
                                <span className="w-1/3 text-right">Amount</span>
                            </div>

                            {payment.map((item) => (
                                <div key={item.id} className="flex text-base py-2">
                                    <span className="w-1/2 truncate">{item.product.name}</span>
                                    <span className="w-1/6 text-center">{item.quantity}</span>
                                    <span className="w-1/3 text-right">birr {item.subtotal}</span>
                                </div>
                            ))}

                            <div className="border-t border-dashed my-4"></div>

                            <div className="flex justify-between font-medium text-lg">
                                <span>Total</span>
                                <span>birr {payment.reduce((sum, item) => sum + parseFloat(item.subtotal), 0).toFixed(2)}</span>
                            </div>

                            <div className="border-t my-6"></div>

                            <div className="text-center">
                                <p className="text-base">Thank you for your purchase!</p>
                                <p className="mt-2 text-base text-gray-500">Please keep this receipt for your records</p>
                                <p className="mt-4 text-gray-400 text-lg">* * * * *</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PaymentTransaction;