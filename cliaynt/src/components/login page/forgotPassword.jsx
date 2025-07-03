import React, { useState } from 'react';
import api from '../../api';
import { Toaster, toast } from 'react-hot-toast';
import logo from '../../images/jejan.svg';
import banner from '../../images/left.png';

function ForgotPassword() {
    const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: OTP & new password
    const [userType, setUserType] = useState(''); // 'supplier' or 'customer'
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [forgotData, setForgotData] = useState({
        email: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (field, value) => {
        setForgotData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const goBackToEmail = () => {
        setCurrentStep(1);
        setForgotData({
            email: forgotData.email,
            verificationCode: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        setIsCheckingEmail(true);

        const { email } = forgotData;

        if (!email) {
            setIsCheckingEmail(false);
            return toast.error('Please enter your email address!');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setIsCheckingEmail(false);
            return toast.error('Please enter a valid email address!');
        }

        if (!userType) {
            setIsCheckingEmail(false);
            return toast.error('Please select your account type!');
        }

        try {
            if (userType === 'supplier') {
                const result = await api.post('/supplier/check-email', { email });
                if (result.data.status) {
                    setIsCheckingEmail(false);
                    setCurrentStep(2);
                } else {
                    setIsCheckingEmail(false);
                    toast.error(result.data.message || 'Email not found');
                    console.log(result.data.message);
                }
            } else {
                const result = await api.post('/customer/check-email', { email });
                if (result.data.status) {
                    setIsCheckingEmail(false);
                    setCurrentStep(2);
                } else {
                    setIsCheckingEmail(false);
                    toast.error(result.data.message || 'Email not found');
                    console.log(result.data.message);
                }
            }
        } catch (err) {
            setIsCheckingEmail(false);
            toast.error(err.response?.data?.message || 'An error occurred');
            console.log(err);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        const { verificationCode, newPassword, confirmPassword, email } = forgotData;

        if (!verificationCode || !newPassword || !confirmPassword) {
            return toast.error('Please fill all fields!');
        }

        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match!');
        }

        if (newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters long!');
        }

        setIsResettingPassword(true);

        try {
            const result = await api.post(`/change-password`, {
                email,
                verificationCode,
                newPassword,
                userType
            });

            if (result.data.status) {
                toast.success(`Password reset successful for ${userType} account!`);
                // Optional: Reset form or redirect
                setForgotData({
                    email: '',
                    verificationCode: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setCurrentStep(1);
                setUserType('');
            } else {
                toast.error(result.data.message || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            toast.error(error.response?.data?.message || 'An error occurred while resetting your password. Please try again.');
        } finally {
            setIsResettingPassword(false);
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            {currentStep === 1 ? 'Reset Your Password' : 'Enter Verification Code'}
                        </h1>
                        <p className="text-sm text-gray-600">
                            {currentStep === 1 ? (
                                <>

                                </>
                            ) : (
                                <>
                                    Didn't receive the code? <button
                                        onClick={goBackToEmail}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Try different email
                                    </button>
                                </>
                            )}
                        </p>
                    </div>

                    {/* Step 1: Email Form */}
                    {currentStep === 1 && (
                        <div className="space-y-4 max-w-sm mx-auto">
                            {/* User Type Selection */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Account Type</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="userType"
                                            value="customer"
                                            checked={userType === 'customer'}
                                            onChange={(e) => setUserType(e.target.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            disabled={isCheckingEmail}
                                        />
                                        <span className="ml-2 text-sm text-gray-700 flex items-center">
                                            🛒 Customer
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="userType"
                                            value="supplier"
                                            checked={userType === 'supplier'}
                                            onChange={(e) => setUserType(e.target.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            disabled={isCheckingEmail}
                                        />
                                        <span className="ml-2 text-sm text-gray-700 flex items-center">
                                            🏢 Supplier
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={forgotData.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                    placeholder="your@email.com"
                                    disabled={isCheckingEmail}
                                />
                            </div>

                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Select your account type and enter your email. OTP will be sent automatically.
                            </div>

                            <button
                                onClick={handleEmailSubmit}
                                disabled={isCheckingEmail}
                                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isCheckingEmail ? 'Verifying Email...' : 'Send OTP'}
                            </button>
                        </div>
                    )}

                    {/* Step 2: OTP and New Password Form */}
                    {currentStep === 2 && (
                        <div className="space-y-4 max-w-sm mx-auto">
                            {/* User Type Indicator */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-800 font-medium">
                                            Account Type: {userType === 'supplier' ? 'Supplier' : 'Customer'}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Email: {forgotData.email}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${userType === 'supplier'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {userType === 'supplier' ? '🏢 Supplier' : '🛒 Customer'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Code */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={forgotData.verificationCode}
                                    onChange={e => handleInputChange('verificationCode', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                    placeholder="Enter 6-digit code"
                                    maxLength="6"
                                    disabled={isResettingPassword}
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={forgotData.newPassword}
                                    onChange={e => handleInputChange('newPassword', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                    placeholder="••••••••"
                                    disabled={isResettingPassword}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={forgotData.confirmPassword}
                                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                                    placeholder="••••••••"
                                    disabled={isResettingPassword}
                                />
                            </div>

                            {/* Password Requirements */}
                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Password must be at least 6 characters long
                            </div>

                            <button
                                onClick={handlePasswordReset}
                                disabled={isResettingPassword}
                                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow transition-all duration-300 transform hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isResettingPassword ? 'Resetting Password...' : 'Reset Password'}
                            </button>

                            {/* Back to Email Button */}
                            <button
                                onClick={goBackToEmail}
                                disabled={isResettingPassword}
                                className="w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg shadow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Back to Email
                            </button>
                        </div>
                    )}
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

export default ForgotPassword;