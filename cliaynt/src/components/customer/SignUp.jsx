import React, { useState } from 'react'
import logo from '../../images/jejan.svg';
import banner from '../../images/login banner.jpg';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../../api';

function SignUp() {
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        image: ''
    });

    const [agree, setAgree] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, phone } = customer;

        if (!name || !email || !password || !phone) {
            return toast.error('Please fill all fields!');
        }

        if (!agree) {
            return toast.error('You must agree to the terms and conditions');
        }

        try {
            const result = await api.post('/customer/sign-up', customer);

            if (result.data.status) {
                toast.success(result.data.message);
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
                        <div className="flex flex-col items-center mb-4">
                            <div className="relative mb-1">
                                <img
                                    className="relative w-48 h-24"
                                    src={logo}
                                    alt="ConstructEasy Logo"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create your account</h1>
                        <p className="text-sm text-gray-600">
                            Already have an account? <Link to="/customer-sign-in" className="text-blue-600 hover:text-blue-800 font-medium">Sign in</Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={customer.name}
                                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                placeholder="Your name"
                            />
                        </div>

                        {/* Email and Password in a row */}
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={customer.email}
                                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={customer.password}
                                    onChange={e => setCustomer({ ...customer, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={customer.phone}
                                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                placeholder="+251 902 920301"
                            />
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={() => setAgree(!agree)}
                                id="terms"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                                I agree to the <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">terms and conditions</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow transition-all duration-300 transform hover:translate-y-[-2px]"
                        >
                            Create Account
                        </button>
                    </form>
                </div>
            </div>

            {/* Right section - Banner Image */}
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
                <div className="w-full h-full flex items-end p-10  bg-gradient-to-br from-blue-600/80 to-indigo-900/60">
                    <div className="text-white max-w-lg">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Quality Materials, <br /><span className="text-blue-300">Solid Results</span></h2>
                        <p className="text-gray-200 text-base">Join our marketplace and find quality construction materials from trusted suppliers.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;