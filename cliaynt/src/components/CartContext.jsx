import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // ✅ Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // ✅ Sync localStorage when cart updates
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        let updatedCart = [...cart];

        if (updatedCart.length > 0) {
            const existingSupplierId = updatedCart[0].supplierId;
            if (existingSupplierId !== product.supplierId) {
                alert("You cannot add items from different suppliers.");
                return;
            }
        }

        const existingProduct = updatedCart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            updatedCart.push({ ...product, quantity: 1 });
        }

        setCart(updatedCart); // ✅ State updates automatically update localStorage
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

// ✅ Ensure useCart works properly
export const useCart = () => useContext(CartContext);
