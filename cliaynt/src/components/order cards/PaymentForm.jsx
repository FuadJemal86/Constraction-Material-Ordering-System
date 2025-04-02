import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api';
import { Link, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
// import { Notyf } from "notyf";
// import 'notyf/notyf.min.css';

function PaymentForm() {

    const { id } = useParams()


    // State for cart and pricing
    const navigator = useNavigate()
    const [cartItems, setCartItems] = useState([]);
    const [paymentPayed, setPaymentPayed] = useState([])
    const [supplierDetails, setSupplierDetails] = useState(null);
    const [isCloth, setCloth] = useState(true)
    const [account, setAccount] = useState([])
    const [payment, setPayment] = useState({
        bankId: '',
        bankTransactionId: '',
        image: ''
    })

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
    }, [])


    useEffect(() => {
        const feachAccount = async () => {
            const result = await api.get('/supplier/get-account')

            try {
                if (result.data.status) {
                    setAccount(result.data.result)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
                toast.error(err.response.data.message)
            }
        }
        feachAccount()
    }, [])


    const handleCloth = () => {
        setCloth(false)
        navigator('/products')

    }


    const handleSubmit = async (c) => {
        c.preventDefault()

        const formData = new FormData()

        formData.append('bankId', payment.bankId)
        formData.append('bankTransactionId', payment.bankTransactionId)
        formData.append('image', payment.image)


        try {
            const result = await api.post(`/customer/make-payment/${id}`, formData)
            if (result.data.status) {
                feachPayment()
                toast.success(result.data.message)
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setPayment({ ...payment, image: file });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    // panding payment

    useEffect(() => {
        feachPayment()
    }, [])

    const feachPayment = async () => {
        try {
            const result = await api.get(`/customer/get-pending-payment/${id}`)

            if (result.data.status) {
                console.log(result.data.paymentStatus)
                setPaymentPayed(result.data.paymentStatus)
            } else {
                console.log(result.data.message)
                return
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Calculation of totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = 0.08; // 8% tax
    const shippingCost = 10; // Flat shipping rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;


    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            {
                isCloth ? (
                    <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center md:justify-end">
                        {/* Payment Form Section */}
                        <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full md:h-auto max-h-full overflow-y-auto shadow-xl md:mr-4 md:my-4 md:rounded-lg">
                            {/* Payment Form Section */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className='flex justify-between items-center sticky mb-6'>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payment Details</h2>
                                    <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full'
                                        onClick={handleCloth}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form className="space-y-4" onSubmit={handleSubmit}>

                                    <div className="grid grid-cols-1 gap-4">
                                        <select className='w-full p-3 border rounded-lg focus:outline-none    focus:ring-2 focus:ring-blue-500'
                                            onChange={e => setPayment({ ...payment, bankId: e.target.value })}
                                        >
                                            <option>
                                                Banck Branch
                                            </option>
                                            {
                                                account.map(c => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.bankName}: {c.account}
                                                    </option>
                                                ))
                                            }

                                        </select>

                                        <input
                                            onChange={e => setPayment({ ...payment, bankTransactionId: e.target.value })}
                                            type="text"
                                            name="zipCode"
                                            placeholder="Bank Transaction Id"
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Payment Method */}
                                    <div className="flex h-10">
                                        <label className="flex-1 flex justify-center items-center border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center text-gray-500">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <span className="text-sm">screen shoot</span>
                                            </div>
                                            <input
                                                onChange={handleImageChange}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>

                                    {
                                        paymentPayed.status === 'PENDING' ? (
                                            <div
                                                type="submit"
                                                className="w-full bg-blue-400 text-white py-3 rounded-lg hover:bg-blue-500 transition duration-300 cursor-not-allowed text-center"
                                            >
                                                PENDING
                                            </div>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                                            >
                                                Complete Payment
                                            </button>

                                        )
                                    }

                                </form>
                            </div>

                            {/* Order Summary Section */}
                            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center border-b pb-2">
                                            <div className="flex items-center">
                                                <img
                                                    src={`http://localhost:3032/images/${item.image}`}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                                />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold">birr {(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between">
                                        <p>Subtotal</p>
                                        <p>birr {subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Tax (8%)</p>
                                        <p>birr {tax.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Shipping</p>
                                        <p>birr {shippingCost.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <p>Total</p>
                                        <p>birr {total.toFixed(2)}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ) : (
                    null
                )
            }
        </div>
    );
}

export default PaymentForm;