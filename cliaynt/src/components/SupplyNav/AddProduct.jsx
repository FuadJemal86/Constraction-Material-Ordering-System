import React, { useEffect, useState } from 'react';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';

function AddProduct() {
    const [category, setCategory] = useState([]);
    const [hasDelivery, setHasDelivery] = useState(false);
    const [product, setProduct] = useState({
        name: "",
        categoryId: "",
        price: "",
        stock: "",
        image: "",
        offersDelivery: false,
        deliveryPricePerKm: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, categoryId, price, stock, image, offersDelivery, deliveryPricePerKm } = product;

        // Basic validation
        if (!name || !categoryId || !price || !stock || !image) {
            return toast.error('Please fill all required fields');
        }

        if (offersDelivery && !deliveryPricePerKm) {
            return toast.error('Please provide delivery price per kilometer');
        }

        const formData = new FormData();

        // Append form fields to FormData
        formData.append('name', product.name);
        formData.append('categoryId', product.categoryId);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('image', product.image);
        formData.append('offersDelivery', product.offersDelivery);
        if (product.offersDelivery) {
            formData.append('deliveryPricePerKm', product.deliveryPricePerKm);
        }

        try {
            const result = await api.post('/supplier/add-product', formData);

            if (result.data.status) {
                toast.success(result.data.message);
                // Reset form after successful submission
                setProduct({
                    name: "",
                    categoryId: "",
                    price: "",
                    stock: "",
                    image: "",
                    offersDelivery: false,
                    deliveryPricePerKm: ""
                });
                setHasDelivery(false);
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/customer/get-category');

                if (result.data.status) {
                    setCategory(result.data.category);
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.log(err);
                toast.error(err.response?.data?.message || 'Failed to load categories');
            }
        };

        fetchData();
    }, []);

    const handleDeliveryToggle = (value) => {
        setHasDelivery(value);
        setProduct({ ...product, offersDelivery: value });
        if (!value) {
            setProduct({ ...product, offersDelivery: value, deliveryPricePerKm: "" });
        }
    };

    // Preview image state
    const [previewImage, setPreviewImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProduct({ ...product, image: file });
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    return (
        <div className="flex justify-center items-center p-4 bg-gray-50">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-80 bg-white rounded-lg shadow-md p-5 border border-gray-100">
                <h2 className="text-lg font-bold text-center mb-4 text-indigo-700">Add Product</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            value={product.name}
                            onChange={e => setProduct({ ...product, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:outline-none"
                            placeholder="Product Name"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={product.categoryId}
                            onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:outline-none appearance-none"
                        >
                            <option value="" disabled>Select a category</option>
                            {
                                category.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.category}
                                    </option>
                                ))
                            }
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    <div>
                        <input
                            value={product.price}
                            onChange={e => setProduct({ ...product, price: e.target.value })}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:outline-none"
                            placeholder="Price"
                            type="number"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <input
                            value={product.stock}
                            onChange={e => setProduct({ ...product, stock: e.target.value })}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:outline-none"
                            placeholder="Stock"
                            type="number"
                            min="0"
                        />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium mb-2">Delivery Options</div>
                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <input
                                    id="delivery-yes"
                                    type="radio"
                                    name="delivery"
                                    checked={hasDelivery}
                                    onChange={() => handleDeliveryToggle(true)}
                                    className="h-4 w-4 text-indigo-600"
                                />
                                <label htmlFor="delivery-yes" className="ml-1 text-sm text-gray-700">
                                    Delivery
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="delivery-no"
                                    type="radio"
                                    name="delivery"
                                    checked={!hasDelivery}
                                    onChange={() => handleDeliveryToggle(false)}
                                    className="h-4 w-4 text-indigo-600"
                                />
                                <label htmlFor="delivery-no" className="ml-1 text-sm text-gray-700">
                                    No Delivery
                                </label>
                            </div>
                        </div>
                        
                        {hasDelivery && (
                            <div className="mt-2">
                                <input
                                    value={product.deliveryPricePerKm}
                                    onChange={e => setProduct({ ...product, deliveryPricePerKm: e.target.value })}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:outline-none"
                                    placeholder="Price per KM"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        {previewImage && (
                            <div className="mb-2 flex justify-center">
                                <div className="relative inline-block">
                                    <img src={previewImage} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setPreviewImage(null);
                                            setProduct({...product, image: ""});
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                        <label className="flex justify-center items-center w-full h-16 transition bg-white border border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span className="text-sm text-gray-500">Upload image</span>
                            </div>
                            <input
                                onChange={handleImageChange}
                                type="file" className="hidden" accept="image/*" 
                            />
                        </label>
                    </div>

                    <button className="w-full py-2 px-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors">
                        Post Product
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;