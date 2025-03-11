import React from 'react';

function AddProduct() {
    return (
        <div className="flex justify-center items-center p-6 bg-gray-50 mt-6">
            <div className="w-96 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-center mb-6 text-indigo-800">Post Product</h2>

                <div className="space-y-5">
                    <div className="group">
                        <input
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-colors"
                            placeholder="Name"
                        />
                    </div>

                    <div className="relative">
                        <select
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-colors appearance-none"
                        >
                            <option value="" disabled selected>Select a category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="food">Food</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    <div>
                        <input
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-colors"
                            placeholder="Price"
                            type="number"
                        />
                    </div>

                    <div>
                        <input
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-colors"
                            placeholder="Stock"
                            type="number"
                        />
                    </div>

                    <div className="relative">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Product Image</label>
                        <label className="flex justify-center items-center w-full h-20 px-4 transition bg-white border-2 border-gray-200 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 hover:border-indigo-300">
                            <div className="flex items-center space-x-2">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span className="text-sm text-gray-500">Upload image</span>
                            </div>
                            <input type="file" className="hidden" accept="image/*" />
                        </label>
                    </div>

                    <button className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200">
                        Post Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;