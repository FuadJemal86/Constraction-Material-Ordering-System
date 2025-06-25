import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        let updatedCart = [...cart];

        const existingProduct = updatedCart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            updatedCart.push({ ...product, quantity: 1 });
        }

        setCart(updatedCart);
    };

    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;

        setCart((prevCart) =>
            prevCart.map((item, i) =>
                i === index ? { ...item, quantity: newQuantity } : item
            )
        );
    };



    // In your CartContext.js
    const removeItem = (index) => {
        setCart(prevCart => {
            const newCart = [...prevCart];
            newCart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, updateQuantity, removeItem }}>
            {children}
        </CartContext.Provider>
    );
};


export const useCart = () => useContext(CartContext);
