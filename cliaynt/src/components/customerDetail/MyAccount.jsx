import React, { useEffect, useState } from 'react'
import Setting from './Setting';
import RecentOrder from './RecentOrder';
import api from '../../api';
import toast from 'react-hot-toast';


function MyAccount() {
    const [activeTab, setActiveTab] = useState('profile');
    const [editMode, setEditMode] = useState(false);

    // Example user data
    const [userData, setUserData] = useState({
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        address: "123 Main Street, Anytown, ST 12345"
    });

    useEffect(() => {
        const feachData = async () => {
            try {
                const result = await api.get('/customer/get-profile')
                if (result.data.status) {
                    setUserData(result.data.customer)
                } else {
                    toast.error(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        feachData()
    })


    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic would go here
        setEditMode(false);
    };
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

                    {editMode ? (
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={userData.address}
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
                                <p className="mt-1">{userData.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                                <p className="mt-1">{userData.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</h3>
                                <p className="mt-1">{userData.phone}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                                <p className="mt-1">{userData.address}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <RecentOrder />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <Setting />
            )}
        </div>
    )
}

export default MyAccount
