import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard, ArrowLeft, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../api';

function PaymentForm() {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [payment, setPayment] = useState({
        bankId: '',
        bankTransactionId: '',
        image: null
    });

    // Fetch cart items from localStorage
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
    }, []);

    // Fetch bank accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const result = await api.get('/customer/get-account');
                if (result.data.status) {
                    setAccounts(result.data.accounts || []);
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                toast.error('Failed to load bank accounts');
            }
        };
        fetchAccounts();
    }, []);

    // Fetch pending payment status
    useEffect(() => {
        fetchPaymentStatus();
    }, [transactionId]);

    const fetchPaymentStatus = async () => {
        if (!transactionId) return;

        try {
            const result = await api.get(`/customer/get-pending-payment/${transactionId}`);
            if (result.data.status) {
                setPaymentStatus(result.data.paymentStatus);
            }
        } catch (err) {
            console.error('Error fetching payment status:', err);
        }
    };

    const handleGoBack = () => {
        navigate('/products');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPayment({ ...payment, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!payment.bankId) {
            return toast.error('Please select a bank account');
        }

        if (!payment.bankTransactionId) {
            return toast.error('Please enter the transaction ID');
        }

        if (!payment.image) {
            return toast.error('Please upload a payment receipt screenshot');
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('bankId', payment.bankId);
        formData.append('bankTransactionId', payment.bankTransactionId);
        formData.append('image', payment.image);

        try {
            const result = await api.post(`/customer/make-payment/${transactionId}`, formData);
            if (result.data.status) {
                toast.success(result.data.message);
                fetchPaymentStatus();
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment submission failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = 0.08;
    const shippingCost = 10;
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;


    const isPending = paymentStatus?.status === 'PENDING';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <Toaster position="top-center" />

            <div className="max-w-6xl mx-auto">
                {/* Header with back button */}
                <div className="mb-6 flex items-center">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        <span>Back to Products</span>
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                            <CreditCard className="mr-3" size={24} />
                            Complete Your Payment
                        </h1>
                    </div>

                    {/* Main content */}
                    <div className="lg:flex">
                        {/* Left side - Payment Form */}
                        <div className="lg:w-1/2 p-6">
                            {isPending ? (
                                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/30 p-4 mb-6">
                                    <div className="flex items-center">
                                        <AlertCircle className="text-yellow-500 mr-2" size={20} />
                                        <p className="text-yellow-700 dark:text-yellow-400">
                                            Your payment is being processed. We'll update you once it's confirmed.
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Select Bank Account
                                    </label>
                                    <select
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                                 dark:bg-gray-700 dark:border-gray-600 transition-all ${payment.bankId ? 'border-green-500' : 'border-gray-300'
                                            }`}
                                        value={payment.bankId}
                                        onChange={e => setPayment({ ...payment, bankId: e.target.value })}
                                        disabled={isPending}
                                    >
                                        <option value="">Select a bank account</option>
                                        {accounts.map(account => (
                                            <option key={account.id} value={account.id}>
                                                {account.name}: {account.accountNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Transaction ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter bank transaction ID"
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      dark:bg-gray-700 dark:border-gray-600 transition-all ${payment.bankTransactionId ? 'border-green-500' : 'border-gray-300'
                                            }`}
                                        value={payment.bankTransactionId}
                                        onChange={e => setPayment({ ...payment, bankTransactionId: e.target.value })}
                                        disabled={isPending}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Receipt
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg dark:border-gray-700">
                                        {previewImage ? (
                                            <div className="space-y-2 flex flex-col items-center">
                                                <img src={previewImage} alt="Receipt" className="h-40 object-cover rounded-md" />
                                                <button
                                                    type="button"
                                                    className="text-sm text-red-600 hover:text-red-500"
                                                    onClick={() => {
                                                        setPreviewImage(null);
                                                        setPayment({ ...payment, image: null });
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    Remove image
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 text-center">
                                                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                                    >
                                                        <span>Upload a screenshot</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            disabled={isPending}
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-3 px-4 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${isPending
                                        ? 'bg-yellow-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                        } disabled:opacity-75`}
                                    disabled={isPending || isLoading}
                                >
                                    {isLoading ? 'Processing...' : isPending ? 'Payment Pending' : 'Complete Payment'}
                                </button>
                            </form>
                        </div>

                        {/* Right side - Order Summary */}
                        <div className="lg:w-1/2 bg-gray-50 dark:bg-gray-700 p-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                                {cartItems.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center border-b pb-3 dark:border-gray-600">
                                            <div className="flex items-center">
                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
                                                    <img
                                                        src={`http://localhost:3032/images/${item.image}`}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h3>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {(item.price * item.quantity).toFixed(2)} birr
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{subtotal.toFixed(2)} birr</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-600 dark:text-gray-400">Tax (8%)</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{tax.toFixed(2)} birr</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-600 dark:text-gray-400">Shipping</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{shippingCost.toFixed(2)} birr</p>
                                </div>
                                <div className="flex justify-between text-base font-medium pt-4 border-t dark:border-gray-600">
                                    <p className="text-gray-900 dark:text-white">Total</p>
                                    <p className="text-blue-600 dark:text-blue-400 text-xl">{total.toFixed(2)} birr</p>
                                </div>
                            </div>

                            {isPending && (
                                <div className="mt-6 flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <CheckCircle className="text-blue-500 mr-2" size={20} />
                                    <p className="text-blue-700 dark:text-blue-400 text-sm">
                                        Thank you for your order! Your payment is being processed.
                                    </p>
                                </div>
                            )}

                            {/* Payment Security Notice */}
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                    <p>All transactions are secure and encrypted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentForm;