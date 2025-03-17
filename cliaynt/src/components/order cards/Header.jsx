import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import logo from '../../images/logo constraction.jpeg';
import bannerImage from '../../images/banner2 page2.jpg';
import { LightMode, DarkMode, Close } from "@mui/icons-material";
import { Menu, X, Wrench, ChevronDown, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';

function Header() {
    const [address, setAddress] = useState([])
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const supplierIds = storedCart.map(item => item.supplierId); // Extract supplierId

    const [order, setOrder] = useState({
        supplierId: "",
        addressId: "",
        totalPrice: 0
    });

    useEffect(() => {
        if (supplierIds.length > 0) {
            setOrder(prevOrder => ({
                ...prevOrder,
                supplierId: supplierIds[0]
            }));
        }
    }, []);



    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    useEffect(() => {
        if (cartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [cartOpen]);

    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

    const [currentItem, setCurrentItem] = useState({
        name: "",
        price: 0,
        quantity: 1,
        unit: "KG", // Default unit
        totalPrice: 0
    });

    const unitTypes = ["KG", "Ton", "Liter", "Piece", "Meter", "Pack"];

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);


    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = [...cart];
        updatedCart[index].quantity = newQuantity;
        updatedCart[index].totalPrice = updatedCart[index].price * newQuantity;
        setCart(updatedCart);
    };


    const updateUnit = (index, newUnit) => {
        const updatedCart = [...cart];
        updatedCart[index].unit = newUnit;
        setCart(updatedCart);
    };


    const removeItem = (index) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
    };


    const handleItemChange = (e) => {
        const { name, value } = e.target;
        const updatedItem = { ...currentItem };

        if (name === "price" || name === "quantity") {
            updatedItem[name] = parseFloat(value) || 0;

            updatedItem.totalPrice = updatedItem.price * updatedItem.quantity;
        } else {
            updatedItem[name] = value;
        }

        setCurrentItem(updatedItem);
    };

    const addToCart = () => {
        if (!currentItem.name || currentItem.price <= 0 || currentItem.quantity <= 0) {
            toast.error("Please enter valid product details");
            return;
        }

        setCart([...cart, { ...currentItem }]);

        setCurrentItem({
            name: "",
            price: 0,
            quantity: 1,
            unit: "KG",
            totalPrice: 0
        });
    };

    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    useEffect(() => {
        setOrder((prev) => ({ ...prev, totalPrice: cartTotal }));
    }, [cartTotal]);

    useEffect(() => {
        const feachData = async () => {
            try {
                const result = await api.get('/customer/get-address')

                if (result.data.status) {
                    setAddress(result.data.address)
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

    const handelSubmit = async (c) => {
        c.preventDefault()
        console.log(order)

        try {
            const result = await api.post('/customer/place-order', order)
            if (result.data.status) {
                toast.success(result.data.message)
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message)
        }
    }

    return (
        <div>
            <div>
                <Toaster position="top-center" reverseOrder={false} />
                <header className="relative">
                    <div className='flex items-center justify-between md:p-2 p-1 fixed right-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-md'>
                        <div className='flex items-center'>
                            <img className='w-11 h-11 md:w-16 md:h-16 dark:bg-white rounded-full' src={logo} alt="ConstracEase Logo" />

                            <div className='font-bold text-lg md:text-2xl md:px-2'>
                                <p>ConstracEase</p>
                            </div>
                        </div>

                        <div className='hidden md:flex justify-center w-full'>
                            <nav>
                                <ul className='flex gap-6 font-semibold'>
                                    <li><Link className="hover:text-yellow-500 transition-colors">Home</Link></li>
                                    <li><Link className="hover:text-yellow-500 transition-colors">Catagory</Link></li>
                                    <li><Link className="hover:text-yellow-500 transition-colors">About Us</Link></li>
                                    <li><Link className="hover:text-yellow-500 transition-colors">Contact</Link></li>
                                </ul>
                            </nav>
                        </div>

                        <div className="relative max-w-sm hidden md:block">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full outline-none border border-gray-200 dark:border-gray-800 p-2 pl-10 rounded-3xl dark:bg-gray-900"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className='flex gap-2 md:gap-5 items-center'>
                            <button
                                className="relative hidden md:block"
                                onClick={() => setCartOpen(true)}
                            >
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <ShoppingCartOutlinedIcon className="text-2xl" />
                                </div>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[12px] font-bold p-1 rounded-full">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>

                            <div className="relative hidden md:block">
                                <button className="w-10 h-10 flex items-center justify-center">
                                    <NotificationsNoneIcon className="text-2xl" />
                                </button>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 mt-1 rounded-full">
                                    3
                                </span>
                            </div>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-1 md:p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded flex items-center"
                            >
                                {darkMode ? <LightMode className="text-xl md:text-2xl" /> : <DarkMode className="text-xl md:text-2xl" />}
                            </button>

                            <button
                                className='md:hidden p-1'
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-10 pt-16">
                            <div className="flex flex-col p-5">
                                <div className="mb-6 mt-7">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full mt-2 outline-none border border-gray-200 dark:border-gray-800 p-3 pl-10 rounded-3xl dark:bg-gray-900"
                                    />
                                    <FaSearch className="absolute left-8 top-[9.1rem] transform -translate-y-1/2 text-gray-500" />
                                </div>

                                <nav>
                                    <ul className="flex flex-col space-y-4">
                                        <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                            <Link className="text-lg font-medium block">Explore</Link>
                                        </li>
                                        <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                            <Link className="text-lg font-medium block">Catagory</Link>
                                        </li>
                                        <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                            <Link className="text-lg font-medium block">About Us</Link>
                                        </li>
                                        <li className="p-2 border-b border-gray-100 dark:border-gray-800">
                                            <Link className="text-lg font-medium block">Contact</Link>
                                        </li>
                                    </ul>
                                </nav>

                                <div className="mt-auto pt-6">
                                    <div className="flex items-center space-x-2 p-2 border-b border-gray-100 dark:border-gray-800">
                                        <NotificationsNoneIcon className="text-2xl" />
                                        <span>Notifications</span>
                                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
                                    </div>

                                    <div
                                        className="flex items-center space-x-2 p-2 border-b border-gray-100 dark:border-gray-800 cursor-pointer"
                                        onClick={() => setCartOpen(true)}
                                    >
                                        <ShoppingCartOutlinedIcon className="text-2xl" />
                                        <span>Cart</span>
                                        {cartItemCount > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Simple Shopping Cart Modal */}
                    {/* Shopping Cart Modal with Quantity and Unit Selection */}
                    {cartOpen && (
                        <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center md:justify-end">
                            <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full md:h-auto max-h-full overflow-y-auto shadow-xl md:mr-4 md:my-4 md:rounded-lg">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900">
                                    <h2 className="text-xl font-bold flex items-center">
                                        <ShoppingCartOutlinedIcon className="mr-2" />
                                        Your Cart ({cartItemCount})
                                    </h2>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-4">
                                    {/* Add Item Form */}
                                    {/* <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <h3 className="font-semibold mb-3 text-base">Add New Item</h3>
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-12">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Product Name"
                                                    value={currentItem.name}
                                                    onChange={handleItemChange}
                                                    className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900"
                                                />
                                            </div>
                                            <div className="col-span-5">
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    placeholder="Quantity"
                                                    min="1"
                                                    value={currentItem.quantity}
                                                    onChange={handleItemChange}
                                                    className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900"
                                                />
                                            </div>
                                            <div className="col-span-7">
                                                <select
                                                    name="unit"
                                                    value={currentItem.unit}
                                                    onChange={handleItemChange}
                                                    className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900"
                                                >
                                                    {unitTypes.map(unit => (
                                                        <option key={unit} value={unit}>{unit}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-span-8">
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">birr</span>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        placeholder="Price per unit"
                                                        step="0.01"
                                                        min="0"
                                                        value={`birr ${currentItem.price}`}
                                                        onChange={handleItemChange}
                                                        className="w-full p-2 pl-10 border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900"
                                                    />
                                                </div>
                                            </div>


                                            <div className="col-span-4">
                                                <button
                                                    onClick={addToCart}
                                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold p-2 rounded transition-all"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div> */}

                                    {cart.length === 0 ? (
                                        <div className="text-center py-12">
                                            <ShoppingCartOutlinedIcon style={{ fontSize: '3rem' }} className="text-gray-400 mb-3" />
                                            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mb-4">Start adding items to your cart</p>
                                            <button
                                                onClick={() => setCartOpen(false)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-md transition-all"
                                            >
                                                Continue Shopping
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handelSubmit}>
                                            <>

                                                <div className="divide-y divide-gray-100 dark:divide-gray-800 mb-4">
                                                    {cart.map((item, index) => (
                                                        <div key={index} className="py-3">
                                                            <div className="flex items-center mb-2">
                                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
                                                                    <Wrench className="text-gray-400" size={16} />
                                                                </div>
                                                                <div className="ml-3 flex-grow">
                                                                    <h3 className="font-medium">{item.name}</h3>
                                                                </div>
                                                                <button
                                                                    onClick={() => removeItem(index)}
                                                                    className="p-1 text-gray-500 hover:text-red-500"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-12 gap-2 mt-2">
                                                                <div className="col-span-4 flex items-center">
                                                                    <button
                                                                        onClick={() => updateQuantity(index, item.quantity - 1)}
                                                                        className="p-1 bg-gray-100 dark:bg-gray-800 rounded"
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        min="1"
                                                                        onChange={(e) => setOrder(index, parseInt(e.target.value) || 1)}
                                                                        className="w-full mx-1 p-1 text-center border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900"

                                                                    />
                                                                    <button
                                                                        onClick={() => updateQuantity(index, item.quantity + 1)}
                                                                        className="p-1 bg-gray-100 dark:bg-gray-800 rounded"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                                <div className="col-span-4">
                                                                    <select
                                                                        value={item.unit}
                                                                        onChange={(e) => updateUnit(index, e.target.value)}
                                                                        className="w-full p-1 border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900"
                                                                    >
                                                                        {unitTypes.map(unit => (
                                                                            <option key={unit} value={unit}>{unit}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                <div className="col-span-4 flex justify-between items-center">
                                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                        1
                                                                    </span>
                                                                    <span className="font-medium">birr {(item.price * item.quantity).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-4 w-32 pt-3">
                                                                <select
                                                                    onChange={e => setOrder(prev => ({ ...prev, addressId: parseInt(e.target.value) || "" }))}
                                                                    className="w-full p-1 border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900"
                                                                >
                                                                    <option value="">Select an Address</option>
                                                                    {address?.map(c => (
                                                                        <option key={c.id} value={c.id}>{c.address}</option>
                                                                    ))}
                                                                </select>

                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>


                                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                                    <div className="flex justify-between mb-2">
                                                        <span>Subtotal</span>
                                                        <span className="font-medium">birr {cartTotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between mb-4">
                                                        <span className="font-bold">Total</span>
                                                        <span className="font-bold">birr {cartTotal.toFixed(2)}</span>
                                                    </div>

                                                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-md mb-2 transition-all">
                                                        Order Now
                                                    </button>
                                                    <button
                                                        onClick={() => setCartOpen(false)}
                                                        className="w-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4 rounded-md transition-all"
                                                    >
                                                        Continue Shopping
                                                    </button>
                                                </div>
                                            </>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </header>
            </div>

            <div className={`pt-16 md:pt-20 ${mobileMenuOpen ? 'hidden' : 'block'}`}>
                <div className="relative w-full h-64 md:h-96">
                    <img
                        src={bannerImage}
                        alt="Construction Services"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-16">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 max-w-xl">
                            Building Tomorrow With Quality Today
                        </h1>
                        <p className="text-white/90 text-sm sm:text-base md:text-xl mb-4 md:mb-6 max-w-lg">
                            Professional construction services for residential and commercial projects
                        </p>
                        <div className="flex gap-2 md:gap-4">
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-3 md:py-3 md:px-6 rounded-md text-sm md:text-base transition-all flex items-center gap-1 md:gap-2">
                                <Wrench size={16} className="md:w-5 md:h-5" />
                                Our Services
                            </button>
                            <button className="bg-transparent hover:bg-white/10 text-white border border-white py-2 px-3 md:py-3 md:px-6 rounded-md text-sm md:text-base transition-all">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header