import React, { useEffect, useState } from 'react';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import supplierValidation from '../../hookes/supplierValidation';
import { BlinkBlur, FourSquare } from 'react-loading-indicators'


function AddProduct() {
    supplierValidation()
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState([]);
    const [hasDelivery, setHasDelivery] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [supplierAccount, setSupplierAccount] = useState([])
    const [showAccountForm, setShowAccountForm] = useState(false);
    const [newAccount, setNewAccount] = useState({
        bankName: '',
        account: ''
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [previewImage1, setPreviewImage1] = useState(null);
    const [previewImage2, setPreviewImage2] = useState(null);
    const [previewImage3, setPreviewImage3] = useState(null);
    const [customUnit, setCustomUnit] = useState(false);
    const [product, setProduct] = useState({
        name: "",
        categoryId: "",
        price: "",
        unit: "", // Default unit
        stock: 0,
        image: "",
        image1: "",
        image2: "",
        image3: "",
        offersDelivery: false,
        deliveryPricePerKm: "",
    });

    // Common units for products
    const commonUnits = [
        { value: "piece", label: "Piece" },
        { value: "kg", label: "kg" },
        { value: "g", label: "g" },
        { value: "lb", label: "lb" },
        { value: "oz", label: "oz" },
        { value: "l", label: "L" },
        { value: "ml", label: "ml" },
        { value: "pack", label: "Pack" },
        { value: "box", label: "Box" },
        { value: "set", label: "Set" },
        { value: "pair", label: "Pair" },
        { value: "custom", label: "Custom..." }
    ];



    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, categoryId, price, unit, stock, image, image1, image2, image3, offersDelivery, deliveryPricePerKm } = product;

        // Basic validation
        if (!name || !categoryId || !price || !stock || !image) {
            return toast.error('Please fill all required fields');
        }

        if (offersDelivery && !deliveryPricePerKm) {
            return toast.error('Please provide delivery price per kilometer');
        }

        if (supplierAccount.length == 0) {
            return toast.error('Please add at least one bank account');
        }

        const formData = new FormData();

        // Append form fields to FormData
        formData.append('name', product.name);
        formData.append('categoryId', product.categoryId);
        formData.append('price', product.price);
        formData.append('unit', product.unit);
        formData.append('stock', product.stock);
        formData.append('image', product.image);

        // Append additional images if they exist
        if (product.image1) formData.append('image1', product.image1);
        if (product.image2) formData.append('image2', product.image2);
        if (product.image3) formData.append('image3', product.image3);

        formData.append('offersDelivery', product.offersDelivery);

        if (product.offersDelivery) {
            formData.append('deliveryPricePerKm', product.deliveryPricePerKm);
        }

        // Append accounts data
        formData.append('accounts', JSON.stringify(accounts));

        try {
            const result = await api.post('/supplier/add-product', formData);

            if (result.data.status) {
                toast.success(result.data.message);
                // Reset form after successful submission
                setProduct({
                    name: "",
                    categoryId: "",
                    price: "",
                    unit: "piece",
                    stock: "",
                    image: "",
                    image1: "",
                    image2: "",
                    image3: "",
                    offersDelivery: false,
                    deliveryPricePerKm: "",
                });
                setHasDelivery(false);
                setPreviewImage(null);
                setPreviewImage1(null);
                setPreviewImage2(null);
                setPreviewImage3(null);
                setCustomUnit(false);
                setAccounts([]);
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const result = await api.get('/supplier/get-account')
            if (result.data.status) {
                setSupplierAccount(result.data.result)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message)
        }
    }

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
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className='relative w-full h-full'>
                <div className="absolute inset-0 flex justify-center items-center text-center bg-white/70 z-30">
                    <BlinkBlur color="#385d38" size="medium" text="" textColor="" />
                </div>
            </div>
        )
    }

    const handleDeliveryToggle = (value) => {
        setHasDelivery(value);
        setProduct({ ...product, offersDelivery: value });
        if (!value) {
            setProduct({ ...product, offersDelivery: value, deliveryPricePerKm: "" });
        }
    };

    // Preview image states


    const handleImageChange = (e, imageField) => {
        const file = e.target.files[0];

        if (file) {
            setProduct({ ...product, [imageField]: file });

            const reader = new FileReader();
            reader.onloadend = () => {
                switch (imageField) {
                    case 'image':
                        setPreviewImage(reader.result);
                        break;
                    case 'image1':
                        setPreviewImage1(reader.result);
                        break;
                    case 'image2':
                        setPreviewImage2(reader.result);
                        break;
                    case 'image3':
                        setPreviewImage3(reader.result);
                        break;
                }
            };
            reader.readAsDataURL(file);
        } else {
            switch (imageField) {
                case 'image':
                    setPreviewImage(null);
                    break;
                case 'image1':
                    setPreviewImage1(null);
                    break;
                case 'image2':
                    setPreviewImage2(null);
                    break;
                case 'image3':
                    setPreviewImage3(null);
                    break;
            }
        }
    };

    const removeImage = (imageField) => {
        setProduct({ ...product, [imageField]: "" });
        switch (imageField) {
            case 'image':
                setPreviewImage(null);
                break;
            case 'image1':
                setPreviewImage1(null);
                break;
            case 'image2':
                setPreviewImage2(null);
                break;
            case 'image3':
                setPreviewImage3(null);
                break;
        }
    };

    const handleUnitChange = (e) => {
        const selectedUnit = e.target.value;
        if (selectedUnit === "custom") {
            setCustomUnit(true);
            setProduct({ ...product, unit: "" });
        } else {
            setCustomUnit(false);
            setProduct({ ...product, unit: selectedUnit });
        }
    };

    const handleAddAccount = async () => {
        if (!newAccount.bankName || !newAccount.account) {
            return toast.error('Bank name and account number are required');
        }

        try {
            const result = await api.post('/supplier/add-account', newAccount)

            if (result.data.status) {
                fetchData()
                setAccounts([...accounts, { ...newAccount }]);
                setNewAccount({ bankName: '', account: '' });
                setShowAccountForm(false);
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message)
        }
    };

    const handleDeleteAccount = async (id) => {
        try {
            const result = await api.delete(`/supplier/delete-account/${id}`)
            if (result.data.status) {
                fetchData()
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message)
        }
    };







    return (
        <div className="mt-9 flex justify-center items-center p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Add Product</h2>
                    <div className="flex gap-2">
                        {previewImage && (
                            <div className="relative">
                                <img src={previewImage} alt="Main Preview" className="h-12 w-12 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removeImage('image')}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {previewImage1 && (
                            <div className="relative">
                                <img src={previewImage1} alt="Preview 1" className="h-12 w-12 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removeImage('image1')}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {previewImage2 && (
                            <div className="relative">
                                <img src={previewImage2} alt="Preview 2" className="h-12 w-12 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removeImage('image2')}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {previewImage3 && (
                            <div className="relative">
                                <img src={previewImage3} alt="Preview 3" className="h-12 w-12 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removeImage('image3')}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <input
                            value={product.name}
                            onChange={e => setProduct({ ...product, name: e.target.value })}
                            className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                            placeholder="Product Name *"
                        />

                        <div className="border border-gray-200 rounded-md p-3 mb-3">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Bank Accounts</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowAccountForm(true)}
                                    className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-blue-600"
                                >
                                    +
                                </button>
                            </div>

                            {supplierAccount.length > 0 ? (
                                <div className="space-y-2 mb-2">
                                    {supplierAccount.map((acc, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                            <div>
                                                <span className="text-sm font-medium">{acc.bankName}: </span>
                                                <span className="text-sm">{acc.account}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteAccount(acc.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mb-2">No accounts added yet</p>
                            )}

                            {showAccountForm && (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <select
                                            value={newAccount.bankName}
                                            onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                                            className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none appearance-none"
                                        >
                                            <option value="" disabled>Select Bank *</option>
                                            <option value="CBE">CBE</option>
                                            <option value="Abyssinia">Abyssinia</option>
                                            <option value="Dashen">Dashen</option>
                                            <option value="Hibret">Hibret</option>
                                            <option value="Oromia">Oromia</option>
                                        </select>

                                        <input
                                            value={newAccount.account}
                                            onChange={(e) => setNewAccount({ ...newAccount, account: e.target.value.trim() })}
                                            className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                                            placeholder="Account Number *"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleAddAccount}
                                            className="flex-1 h-8 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAccountForm(false)}
                                            className="flex-1 h-8 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <select
                                value={product.categoryId}
                                onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                                className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none appearance-none"
                            >
                                <option value="" disabled>Select Category *</option>
                                {category.map((c) => (
                                    <option key={c.id} value={c.id}>{c.category}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                    <span className="text-gray-500">Birr</span>
                                </div>
                                <input
                                    value={product.price}
                                    onChange={e => setProduct({ ...product, price: e.target.value })}
                                    className="w-full h-10 pl-8 pr-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                                    placeholder="Price *"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <input
                                value={product.unit}
                                onChange={e => setProduct({ ...product, unit: e.target.value })}
                                className="w-32 h-10 px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                                placeholder="Unit *"
                            />
                        </div>

                        <input
                            value={product.stock}
                            onChange={e => setProduct({ ...product, stock: e.target.value })}
                            className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                            placeholder="Stock Quantity *"
                            type="number"
                            min="0"
                        />

                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <input
                                        id="delivery-yes"
                                        type="radio"
                                        name="delivery"
                                        checked={hasDelivery}
                                        onChange={() => handleDeliveryToggle(true)}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <label htmlFor="delivery-yes" className="ml-2 text-sm text-gray-700">Offers Delivery</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="delivery-no"
                                        type="radio"
                                        name="delivery"
                                        checked={!hasDelivery}
                                        onChange={() => handleDeliveryToggle(false)}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <label htmlFor="delivery-no" className="ml-2 text-sm text-gray-700">No Delivery</label>
                                </div>
                            </div>

                            {hasDelivery && (
                                <div className="flex">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">$</span>
                                        </div>
                                        <input
                                            value={product.deliveryPricePerKm}
                                            onChange={e => setProduct({ ...product, deliveryPricePerKm: e.target.value })}
                                            className="w-full h-10 pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
                                            placeholder="Delivery Price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">per km</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Product Images Section */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Product Images</h3>

                            {/* Main Product Image */}
                            {!previewImage && (
                                <div className="flex h-10">
                                    <label className="flex-1 flex justify-center items-center border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <span className="text-sm">Upload Main Image *</span>
                                        </div>
                                        <input
                                            onChange={(e) => handleImageChange(e, 'image')}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            )}

                            {/* Additional Image 1 */}
                            {!previewImage1 && (
                                <div className="flex h-10">
                                    <label className="flex-1 flex justify-center items-center border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <span className="text-sm">Upload Additional Image 1</span>
                                        </div>
                                        <input
                                            onChange={(e) => handleImageChange(e, 'image1')}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            )}

                            {/* Additional Image 2 */}
                            {!previewImage2 && (
                                <div className="flex h-10">
                                    <label className="flex-1 flex justify-center items-center border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <span className="text-sm">Upload Additional Image 2</span>
                                        </div>
                                        <input
                                            onChange={(e) => handleImageChange(e, 'image2')}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            )}

                            {/* Additional Image 3 */}
                            {!previewImage3 && (
                                <div className="flex h-10">
                                    <label className="flex-1 flex justify-center items-center border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <span className="text-sm">Upload Additional Image 3</span>
                                        </div>
                                        <input
                                            onChange={(e) => handleImageChange(e, 'image3')}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full h-10 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center mt-2"
                        >
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;