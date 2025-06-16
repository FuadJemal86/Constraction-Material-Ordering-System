import React, { useState } from 'react'
import logo from '../../images/jejan.svg';
import banner from '../../images/login banner.jpg';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

function CustomerSignIn() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = customer;

        if (!email || !password) {
            return toast.error('Please fill all fields!');
        }

        try {
            const result = await api.post('/customer/login', customer);

            if (result.data.loginStatus) {
                // Store userId and userType in localStorage
                localStorage.setItem('userId', result.data.userId);
                localStorage.setItem('userType', result.data.userType);

                toast.success(result.data.message);
                navigate('/products');
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            console.log(err);
            return toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex h-screen w-full bg-gray-50">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Left section - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    {/* Logo and brand */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative mb-1">
                            <img
                                className="relative w-48 h-24"
                                src={logo}
                                alt="ConstructEasy Logo"
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Customer Sign In</h1>
                        <p className="text-sm text-gray-600">
                            Don't have an account? <Link to="/customer-sign-up" className="text-blue-600 hover:text-blue-800 font-medium">Sign up</Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={customer.email}
                                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                placeholder="your@email.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={customer.password}
                                onChange={e => setCustomer({ ...customer, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Forgot Password link */}
                        <div className="flex justify-end">
                            <a href="#" className="text-xs text-blue-600 hover:text-blue-800">Forgot password?</a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow transition-all duration-300 transform hover:translate-y-[-2px]"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>

            {/* Right section - Banner Image */}
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
                <div className="w-full h-full flex items-end p-10  bg-gradient-to-br from-blue-600/80 to-indigo-900/60">
                    <div className="text-white max-w-lg">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Quality Materials, <br /><span className="text-blue-300">Solid Results</span></h2>
                        <p className="text-gray-200 text-base">Find quality construction products from trusted suppliers in our marketplace.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerSignIn;