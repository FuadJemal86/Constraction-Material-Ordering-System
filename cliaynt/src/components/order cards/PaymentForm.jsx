import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';
import { X } from 'lucide-react';

function PaymentForm() {

    // State for cart and pricing
    const [cartItems, setCartItems] = useState([]);
    const [supplierDetails, setSupplierDetails] = useState(null);
    const [isCloth , setCloth] = useState(true)

    useEffect(() => {
        // Retrieve cart items from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);

        // Fetch supplier details (you'll need to implement this API endpoint)
        const fetchSupplierDetails = async () => {
            try {
                const response = await api.get('/supplier/bank-details');
                if (response.data.status) {
                    setSupplierDetails(response.data.supplier);
                }
            } catch (error) {
                console.error('Failed to fetch supplier details', error);
                toast.error('Could not retrieve supplier information');
            }
        };

        fetchSupplierDetails();
    }, []);


    const handleCloth = () => {
        setCloth(false)
    }

    // Calculation of totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = 0.08; // 8% tax
    const shippingCost = 10; // Flat shipping rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;


    return (
        <div>
            {
                isCloth  ? (
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

                                <form className="space-y-4">

                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Full Address"
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="Zip Code"
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <select
                                            name="paymentMethod"
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="credit">Credit Card</option>
                                            <option value="debit">Debit Card</option>
                                            <option value="paypal">PayPal</option>
                                        </select>
                                    </div>

                                    {/* Payment Information */}
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            placeholder="Card Number"
                                            className="w-full p-3 border rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            placeholder="MM/YY"
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="cvv"
                                            placeholder="CVV"
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                                    >
                                        Complete Payment
                                    </button>
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
                                            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between">
                                        <p>Subtotal</p>
                                        <p>${subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Tax (8%)</p>
                                        <p>${tax.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Shipping</p>
                                        <p>${shippingCost.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <p>Total</p>
                                        <p>${total.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Supplier Bank Details */}
                                {supplierDetails && (
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                        <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Supplier Bank Details</h3>
                                        <p>Bank Name: {supplierDetails.bankName}</p>
                                        <p>Account Number: **** **** {supplierDetails.bankAccount.slice(-4)}</p>
                                        <p>Account Holder: {supplierDetails.accountHolder}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )
            }
        </div>
    );
}

export default PaymentForm;