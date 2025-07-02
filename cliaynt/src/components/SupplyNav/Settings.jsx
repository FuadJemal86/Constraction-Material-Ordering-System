
import React, { useEffect, useState } from 'react'
import { Menu, Bell, User, Settings, LogOut, ChevronRight, Moon, X, Sun, Camera } from 'lucide-react';
import api from '../../api';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import supplierValidation from '../../hookes/supplierValidation';
import { BlinkBlur, FourSquare } from 'react-loading-indicators'



function SupplierSetting() {
    supplierValidation()
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [profile, setProfile] = useState({});

    const [editedProfile, setEditedProfile] = useState({ ...profile });

    // Apply dark mode class to document body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile({
            ...editedProfile,
            [name]: value
        });
    };

    const handleSubmit = () => {
        setProfile({ ...editedProfile });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile({ ...profile });
        setIsEditing(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setEditedProfile({
            ...profile,
            image: file
        });
    };

    // Close mobile menu when clicking outside
    const closeMobileMenu = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const result = await api.get('/supplier/get-supplier-profile')
            if (result.data.status) {
                setProfile(result.data.supplierPofile)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = async (c) => {

        c.preventDefault()

        const formData = new FormData()
        formData.append('companyName', editedProfile.companyName)
        formData.append('email', editedProfile.email)
        formData.append('password', editedProfile.password)
        formData.append('image', editedProfile.image || '')

        try {
            const result = await api.put('/supplier/edit-profile', formData)

            if (result.data.status) {
                toast.success(result.data.message)
                fetchData()
                setIsEditing(false);
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message)
        }
    }

    const handleLogout = async () => {
        try {
            const result = await api.post('/supplier/logout')

            window.location.href = '/sign-in';
        } catch (err) {
            console.error('Logout failed:', err);
        }
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
        <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            {/* Top Navigation */}
            <Toaster position="top-center" reverseOrder={false} />
            <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="hidden md:block">
                                <div className={`text-xl font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>SupplierOS</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleDarkMode}
                                className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-400 hover:text-gray-500'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-400 hover:text-gray-500'} hover:bg-gray-100 dark:hover:bg-gray-700`}>
                                <Bell size={20} />
                            </button>
                            <div className="flex items-center">
                                {
                                    profile.image?.length > 0 ? (
                                        <img
                                            src={`${api.defaults.baseURL}/images/${profile.image}`}
                                            alt="Profile"
                                            className="h-8 w-8 rounded-full"
                                        />
                                    ) : (
                                        <User size={25} />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex relative">
                {/* Mobile overlay to close sidebar when clicked outside */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                        onClick={closeMobileMenu}
                    />
                )}

                {/* Sidebar Navigation */}
                <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-r w-64 fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static transition duration-200 ease-in-out z-20 pt-16`}>
                    <div className="py-4 px-3">
                        {/* Close button for mobile */}
                        <div className="flex md:hidden justify-end mb-4">
                            <button
                                onClick={closeMobileMenu}
                                className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-400 hover:text-gray-500'} hover:bg-gray-700`}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <div className={`px-3 py-2 text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                Main
                            </div>
                            <a href="#" className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                                <User size={20} className={`mr-3 ${darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                Profile
                            </a>
                            <a href="#" className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                                <Settings size={20} className={`mr-3 ${darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                Settings
                            </a>

                            <a onClick={handleLogout} href="#" className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                                <LogOut size={20} className={`mr-3 ${darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                Logout
                            </a>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-0">
                    <div className="max-w-3xl mx-auto">
                        {/* Breadcrumb */}
                        <nav className="mb-5 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <a href="/supplier-page" className={`hover:${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dashboard</a>
                            <ChevronRight size={16} className="mx-2" />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Profile</span>
                        </nav>

                        {/* Content */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden`}>
                            <div className="p-6 md:p-8">
                                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Profile Settings</h1>

                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-1/3 mb-6 lg:mb-0 flex flex-col items-center lg:mr-8">
                                        <div className="relative group mb-4">
                                            {
                                                profile.image?.length > 0 ? (
                                                    <img
                                                        src={`${api.defaults.baseURL}/images/${profile?.image}`}
                                                        alt="Admin"
                                                        className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white dark:border-gray-700"
                                                    />
                                                ) : (
                                                    <span className='rounded-full border-gray-400'>
                                                        <User size={100} />
                                                    </span>
                                                )
                                            }
                                            {isEditing && (
                                                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-blue-700 p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition-colors">
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
                                            {!isEditing && (
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition duration-300">
                                                    <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="text-white opacity-0 group-hover:opacity-100 transition duration-300"
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center mb-4">
                                            {!isEditing ? (
                                                <>
                                                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{profile.name}</h2>

                                                </>
                                            ) : null}
                                        </div>

                                    </div>

                                    <div className="lg:w-2/3">
                                        {!isEditing ? (
                                            <div className="space-y-6">
                                                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-5`}>
                                                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Personal Information</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Company Name</div>
                                                            <div className={`text-base ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{profile.companyName}</div>
                                                        </div>
                                                        <div>
                                                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Email Address</div>
                                                            <div className={`text-base ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{profile.email}</div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                                                    >
                                                        Edit Profile
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleEdit}>
                                                <div className="space-y-6">
                                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-5`}>
                                                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Edit Profile</h3>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                                    Company Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="companyName"
                                                                    name="companyName"
                                                                    value={editedProfile.name}
                                                                    onChange={handleInputChange}
                                                                    className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                                    Email Address
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="email"
                                                                    name="email"
                                                                    value={editedProfile.email}
                                                                    onChange={handleInputChange}
                                                                    className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                                    Password
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="password"
                                                                    name="password"
                                                                    onChange={handleInputChange}
                                                                    className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-end space-x-3">
                                                        <button
                                                            onClick={handleCancel}
                                                            className={`${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out`}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                                                        >
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SupplierSetting
