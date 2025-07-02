import React, { useEffect, useState } from 'react'
import Setting from './Setting';
import RecentOrder from './RecentOrder';
import api from '../../api';
import toast from 'react-hot-toast';
import { User, Camera } from 'lucide-react';
import PaymentHistory from './PaymentHistory';
import customerValidation from '../../hookes/customerValidation';
import { BlinkBlur, FourSquare } from 'react-loading-indicators'


function MyAccount() {
    customerValidation()
    const [activeTab, setActiveTab] = useState('profile');
    const [editMode, setEditMode] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);


    // Example user data
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const feachData = async () => {
            try {
                const result = await api.get('/customer/my-account')
                if (result.data.status) {
                    setUserData(result.data.user[0])
                } else {
                    toast.error(result.data.message)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        feachData()
    }, [])

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', userData.name)
        formData.append('email', userData.email)
        formData.append('phone', userData.phone)
        formData.append('image', userData.image || '');


        try {
            const result = await api.put('/customer/update-customer-account', formData)
            if (result.data.status) {
                toast.success(result.data.message)
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
        setEditMode(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setUserData({
            ...userData,
            image: file
        });
    };

    if (loading) {
        return (
            <div className=''>
                <div className="absolute inset-0 flex justify-center items-center text-center bg-white/70 z-30">
                    <BlinkBlur color="#385d38" size="medium" text="" textColor="" />
                </div>
            </div>
        )
    }


    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">My Account</h1>

            {/* Account Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'profile' ? 'bg-yellow-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'orders' ? 'bg-yellow-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    Orders
                </button>
                <button
                    onClick={() => setActiveTab('payments')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'payments' ? 'bg-yellow-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    Payment History
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'settings' ? 'bg-yellow-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                >
                    Settings
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Personal Information</h2>
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                        >
                            {editMode ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {/* Profile Picture Area */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-gray-100 dark:border-gray-600">
                                {userData.image && !imageSrc ? (
                                    <img
                                        src={`${api.defaults.baseURL}/images/${userData.image}`}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : imageSrc ? (
                                    <img src={imageSrc} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <User size={64} className="text-gray-400" />
                                )}


                            </div>

                            {editMode && (
                                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full cursor-pointer shadow-md hover:bg-yellow-600 transition-colors">
                                    <Camera size={16} className="text-white" />
                                    <input
                                        type="file"
                                        id="profile-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-medium">{userData.name || 'Your Name'}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{userData.email || 'your.email@example.com'}</p>
                            {editMode && (
                                <p className="text-sm mt-2 text-gray-500 max-w-md">
                                    Upload a new profile picture by clicking the camera icon.
                                    For best results, use an image at least 400×400 pixels.
                                </p>
                            )}
                        </div>
                    </div>

                    {editMode ? (
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userData.phone || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                                <p className="mt-1">{userData.name || '-'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                                <p className="mt-1">{userData.email || '-'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</h3>
                                <p className="mt-1">{userData.phone || '-'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                                <p className="mt-1">{userData.address || '-'}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <RecentOrder />
            )}

            {/* payment history */}

            {activeTab === 'payments' && (
                <PaymentHistory />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <Setting />
            )}
        </div>
    )
}

export default MyAccount
