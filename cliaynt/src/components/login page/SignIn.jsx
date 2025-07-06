import React, { useState } from 'react'
import logo from '../../images/jejan.svg';
import banner from '../../images/left.png';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

function SignIn() {
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = supplier;

        if (!email || !password) {
            return toast.error('Please fill all fields!');
        }

        try {
            const result = await api.post('/supplier/login', supplier);

            if (result.data.loginStatus) {
                // Store userId and userType in localStorage
                localStorage.setItem('userId', result.data.userId);
                localStorage.setItem('userType', result.data.userType);
                navigate('/supplier-page');
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.error('Wrong email or password!');
            } else if (err.message) {
                toast.error(err.message);
            } else {
                toast.error('An unexpected error occurred.');
            }
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
                            <div className="absolute -inset-1"></div>
                            <img
                                className="relative w-48 h-24"
                                src={logo}
                                alt="ConstructEasy Logo"
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Sign in to your account</h1>
                        <p className="text-sm text-gray-600">
                            Don't have an account? <Link to="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">Sign up</Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={supplier.email}
                                onChange={e => setSupplier({ ...supplier, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                placeholder="your@email.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={supplier.password}
                                onChange={e => setSupplier({ ...supplier, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Forgot Password link */}
                        <div className="flex justify-end">
                            <a href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800">Forgot password?</a>
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
                <div className="w-full h-full flex items-end p-10 bg-gradient-to-br from-blue-600/80 to-indigo-900/60">
                    <div className="text-white max-w-lg">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Discover Products, <br /><span className="text-blue-300">Shop with Confidence</span></h2>
                        <p className="text-gray-200 text-base">Jejan E-Commerce connects you with trusted sellers, offering a wide range of quality products for your daily needs in Ethiopia.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default SignIn;