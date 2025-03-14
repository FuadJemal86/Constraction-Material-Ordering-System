import React from 'react';
import { useNavigate } from 'react-router-dom';
import image1 from '../../images/image1_0.jpg';
import api from '../../api';
import toast from 'react-hot-toast';

function Cards() {
    const navigate = useNavigate();

    const products = [
        { id: 1, name: "Product 1", price: "$19.99", image: image1 },
        { id: 2, name: "Product 2", price: "$29.99", image: image1 },
        { id: 3, name: "Product 3", price: "$39.99", image: image1 },
        { id: 4, name: "Product 4", price: "$49.99", image: image1 },
        { id: 5, name: "Product 5", price: "$59.99", image: image1 },
        { id: 6, name: "Product 6", price: "$69.99", image: image1 },
        { id: 7, name: "Product 7", price: "$79.99", image: image1 },
        { id: 8, name: "Product 8", price: "$89.99", image: image1 },
        { id: 9, name: "Product 9", price: "$99.99", image: image1 },
        { id: 10, name: "Product 10", price: "$109.99", image: image1 },
        { id: 11, name: "Product 11", price: "$119.99", image: image1 },
        { id: 12, name: "Product 12", price: "$129.99", image: image1 },
        { id: 13, name: "Product 13", price: "$139.99", image: image1 },
        { id: 14, name: "Product 14", price: "$149.99", image: image1 },
        { id: 15, name: "Product 15", price: "$159.99", image: image1 },
        { id: 16, name: "Product 16", price: "$169.99", image: image1 }
    ];

    const handleOrderClick = async (product) => {
        try {
            const result = await api.get("/customer/verify-token", {
                withCredentials: true,
            });

            if (result.data.valid) {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];

                const existingProduct = cart.find(item => item.id === product.id);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                console.log("Item added to cart:", cart);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.error("Token verification failed!", err);
            navigate("/customer-sign-in");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 dark:border-gray-800">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                            <p className="text-gray-800 font-bold dark:text-white">{product.price}</p>
                            <button
                                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                                onClick={() => handleOrderClick(product)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cards;
