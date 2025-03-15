import React, { useEffect, useState } from 'react';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';

function AddProduct() {

    const [category, setCategory] = useState([])
    const [product, setProduct] = useState({
        name: "",
        categoryId:"",
        price: "",
        stock: "",
        image: ""

    })

    const handelSubmit = async (c) => {

        c.preventDefault()

        

        const { name, categoryId, price, stock, image } = product

        if (!name || !categoryId || !price || !stock || !image) {
            return toast.error('fill the field')
        }

        const formData = new FormData();

        // Append form fields to FormData
        formData.append('name', product.name);
        formData.append('categoryId', product.categoryId);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('image', product.image);

        try {
            const result = await api.post('/supplier/add-product', formData)

            if (result.data.status) {
                toast.success(result.data.message)
            } else {
                toast.error(result.data, message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {

        const feachData = async () => {

            try {
                const result = await api.get('/customer/get-category')

                if (result.data.status) {
                    setCategory(result.data.category)
                } else {
                    toast.error(result.data.message)
                }
            } catch (err) {
                console.log(err)
                toast.error(err.response.data.message)
            }
        }

        feachData()

    }, [])
    return (
        <div className="flex justify-center items-center p-6 bg-gray-50 mt-6">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-96 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-center mb-6 text-indigo-800">Post Product</h2>

                <form onSubmit={handelSubmit}>
                    <div className="space-y-5">
                        <div className="group">
                            <input
                                onChange={e => setProduct({ ...product, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-colors"
                                placeholder="Name"
                            />
                        </div>

                        <div className="relative">
                            <select
                                onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                                defaultValue=""
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-colors appearance-none"
                            >
                                <option value="" disabled>Select a category</option>
                                {
                                    category.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.category} {/* Ensure this matches your category field */}
                                        </option>
                                    ))
                                }
                            </select>

                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>

                        <div>
                            <input
                                onChange={e => setProduct({ ...product, price: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-colors"
                                placeholder="Price"
                                type="number"
                            />
                        </div>

                        <div>
                            <input
                                onChange={e => setProduct({ ...product, stock: e.target.value })}
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
                                <input
                                    onChange={e => setProduct({ ...product, image: e.target.files[0] })}
                                    type="file" className="hidden" accept="image/*" />
                            </label>
                        </div>

                        <button className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200">
                            Post Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;