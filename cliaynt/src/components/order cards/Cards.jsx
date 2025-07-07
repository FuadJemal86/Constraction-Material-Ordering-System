import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import image1 from '../../images/image1_0.jpg';
// import { Notyf } from "notyf";
import api from '../../api';
import toast from 'react-hot-toast';

import 'notyf/notyf.min.css';
import { Notyf } from 'notyf';

function Cards() {
    // const notyf = new Notyf();
    const { id } = useParams(); // supplier ID
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category'); // category ID

    // First useEffect - Fetch all products
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const result = await api.get(`/customer/get-products`);

                if (result.data.status) {
                    console.log('All products:', result.data.product);
                    setAllProducts(result.data.product);
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.log('Error fetching all products:', err);
                toast.error(err.response?.data?.message || "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        }

        fetchAllProducts();
    }, []);

    // Second useEffect - Filter by supplier and category
    useEffect(() => {
        if (allProducts.length > 0) {
            let filtered = allProducts;

            // Filter by supplier ID
            if (id) {
                filtered = filtered.filter(product =>
                    product.supplier_id && product.supplier_id.toString() === id.toString()
                );
            }

            // Filter by category ID
            if (category) {
                filtered = filtered.filter(product =>
                    product.category_id && product.category_id.toString() === category.toString()
                );
            }

            setFilteredProducts(filtered);
            console.log(`Filtered products for supplier ${id} and category ${category}:`, filtered);
        }
    }, [allProducts, id, category]);

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

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                                {/* Sale badge - uncomment and customize as needed */}
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
                                        {/* Optional rating component */}
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
                    <div className='w-full grid grid-cols-1 justify-center items-center text-center'>
                        <span>No Product Found</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cards;