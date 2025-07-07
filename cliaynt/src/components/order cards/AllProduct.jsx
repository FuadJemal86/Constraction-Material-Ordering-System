import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import api from '../../api';
import toast from 'react-hot-toast';

function AllProduct() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const result = await api.get('/customer/get-products');

                if (result.data.status) {
                    console.log(result.data.products);
                    setProducts(result.data.products || result.data.product || []);
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.log(err);
                toast.error(err.response?.data?.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    const handleOrderClick = async (product) => {
        try {
            const result = await api.get("/customer/verify-token", {
                withCredentials: true,
            });

            if (result.data.valid) {
                addToCart(product);
                toast.success("Item added to cart");
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            console.error("Token verification failed!", err);
            navigate("/customer-sign-in");
        }
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg animate-pulse">
                    <div className="h-56 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="p-5">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">All Products</h1>
                <p className="text-gray-600 dark:text-gray-400">Discover our complete product collection</p>
            </div>

            {loading ? (
                <LoadingSkeleton />
            ) : (
                <div>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                                    {/* Sale badge */}
                                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg z-10 font-medium">SALE</div>

                                    <div className="relative overflow-hidden">
                                        <img
                                            src={`${api.defaults.baseURL}/images/${product.image}`}
                                            alt={product.name}
                                            className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{product.name}</h3>
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-blue-600 dark:text-blue-400 font-bold text-xl">{`birr ${product.price}`}</p>
                                            <div className="flex items-center">
                                                <span className="text-xs ml-1 text-gray-600 dark:text-gray-400">stock {product.stock}/{product.unit}</span>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center group-hover:bg-blue-700"
                                            onClick={() => handleOrderClick(product)}
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='w-full grid grid-cols-1 justify-center items-center text-center py-16'>
                            <div className="text-gray-500 dark:text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                </svg>
                                <h3 className="text-lg font-medium mb-2">No Products Found</h3>
                                <p className="text-sm">There are no products available at the moment.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AllProduct;