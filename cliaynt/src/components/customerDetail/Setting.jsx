import React from 'react'

function Setting() {
    return (
        <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

                <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-medium mb-4">Password</h3>
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                            Change Password
                        </button>
                    </div>

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
