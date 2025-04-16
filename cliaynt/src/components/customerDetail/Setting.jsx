import React, { useState } from 'react'
import api from '../../api'
import toast, { Toaster } from 'react-hot-toast';

function Setting() {

    const [password, setPassword] = useState({
        password: ''
    })
    const [activeTap, setActioveTap] = useState(false)


    const handleInputChange = () => {
        const { name, value } = e.target;
        setPassword({
            ...password,
            [name]: value
        });
    }

    const handelPasswordChange = async (c) => {

        c.preventDefault()

        try {
            const result = await api.put('/customer/password-change', password)

            if (result.data.status) {
                toast.success(result.data.message)
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

                <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-medium mb-4">Password</h3>
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors" onClick={() => setActioveTap(true)}>
                            Change Password
                        </button>
                    </div>

                    {
                        activeTap && (
                            <form onSubmit={handelPasswordChange}>
                                <div>
                                    <label className="block text-sm font-medium mb-1">New Password</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={password.name || ''}
                                        onChange={handleInputChange}
                                        className="w-1/2 p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700"
                                    />
                                </div>
                                <button className="px-4 py-2 mt-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors" >
                                    Save
                                </button>
                            </form>
                        )
                    }

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-medium mb-4">Notifications</h3>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-yellow-500" defaultChecked />
                                <span className="ml-2">Email notifications for order updates</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-yellow-500" defaultChecked />
                                <span className="ml-2">Special offers and promotions</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4 text-red-600 dark:text-red-400">Danger Zone</h3>
                        <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Setting
