import React, { useEffect, useState, useRef } from 'react';
import { FaSearch } from "react-icons/fa";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import logo from '../../images/logo constraction.jpeg';
import bannerImage from '../../images/banner2 page2.jpg';
import { LightMode, DarkMode } from "@mui/icons-material";
import { Menu, X, Wrench, Minus, Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from "../CartContext";
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';

function Header() {
    // Core state management
    const { cart, removeItem } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [cartOpen, setCartOpen] = useState(false);
    
    // Map related state
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [userMarker, setUserMarker] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationAddress, setLocationAddress] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState(null);
    
    // Order state
    const [order, setOrder] = useState({
        supplierId: "",
        totalPrice: 0,
        latitude: null,
        longitude: null,
        deliveryOption: "pickup", // Default to pickup
        deliveryAddress: ""
    });
    
    // Cart calculations
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Effect to set supplierId from first cart item
    useEffect(() => {
        if (cart.length > 0) {
            setOrder(prev => ({
                ...prev,
                supplierId: cart[0].supplierId,
            }));
        }
    }, [cart]);
    
    // Effect to update total price when cart changes
    useEffect(() => {
        setOrder(prev => ({ ...prev, totalPrice: cartTotal }));
    }, [cartTotal]);
    
    // Dark mode toggle effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);
    
    // Body scroll lock when cart is open
    useEffect(() => {
        document.body.style.overflow = cartOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [cartOpen]);

    // Map initialization
    useEffect(() => {
        if (cartOpen) {
            loadGoogleMapsScript()
                .then(() => initializeMap())
                .catch(error => {
                    console.error("Failed to load map:", error);
                    setMapError("Failed to load Google Maps. Please refresh the page.");
                    setIsLoading(false);
                });
        }
    }, [cartOpen]);

    // Add map click event listener
    useEffect(() => {
        if (map) {
            window.google.maps.event.addListener(map, 'click', handleMapClick);
            return () => {
                window.google.maps.event.clearListeners(map, 'click');
            };
        }
    }, [map]);

    // Load Google Maps API
    const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const apiKey = "AIzaSyBThb9ieJOIHzM_616ZKBE31ibU8yIDuIs";
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Google Maps API'));
            document.body.appendChild(script);
        });
    };

    // Initialize the map
    const initializeMap = () => {
        if (!mapRef.current) return;

        const defaultCenter = { lat: 9.145, lng: 40.4897 }; // Ethiopia center
        
        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 6,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_CENTER
            }
        });

        // Add my location button
        const locationButton = document.createElement("button");
        locationButton.innerHTML = `
            <div style="background-color: #fff; border: 2px solid #fff; border-radius: 3px; 
                        box-shadow: 0 2px 6px rgba(0,0,0,.3); cursor: pointer; text-align: center; 
                        width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-location-arrow" style="color: #1a73e8; font-size: 18px;"></i>
            </div>
        `;
        locationButton.classList.add("custom-map-control-button");
        locationButton.setAttribute("title", "Find my location");
        locationButton.type = "button";
        locationButton.addEventListener("click", getUserLocation);

        mapInstance.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
        
        setMap(mapInstance);
        setIsLoading(false);
    };

    // Get human-readable address from coordinates
    const getAddressFromCoordinates = (latitude, longitude) => {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(latitude, longitude);
        
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
                const address = results[0].formatted_address;
                setLocationAddress(address);
                setOrder(prev => ({
                    ...prev,
                    deliveryAddress: address
                }));
            } else {
                setLocationAddress("Address not found");
                setOrder(prev => ({
                    ...prev,
                    deliveryAddress: ""
                }));
            }
        });
    };

    // Get user's current location
    const getUserLocation = () => {
        setIsLoading(true);

        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser.');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                
                // Update state with location
                setUserLocation({ latitude, longitude });
                setOrder(prev => ({
                    ...prev,
                    latitude,
                    longitude
                }));
                
                // Get address
                getAddressFromCoordinates(latitude, longitude);
                
                // Update map
                if (map) {
                    const userPos = new window.google.maps.LatLng(latitude, longitude);
                    map.setCenter(userPos);
                    map.setZoom(14);

                    // Update marker
                    if (userMarker) userMarker.setMap(null);
                    
                    const newMarker = new window.google.maps.Marker({
                        position: userPos,
                        map: map,
                        title: 'Your Location',
                        icon: {
                            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            scaledSize: new window.google.maps.Size(40, 40)
                        }
                    });
                    
                    setUserMarker(newMarker);
                }
                
                setIsLoading(false);
                toast.success('Location found successfully!');
            },
            error => {
                console.error('Geolocation error:', error);
                let message = 'Location permission denied. Please enable it in your browser.';
                if (error.code === error.POSITION_UNAVAILABLE) {
                    message = 'Location information is unavailable.';
                } else if (error.code === error.TIMEOUT) {
                    message = 'Request to get location timed out.';
                }
                
                toast.error(message);
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Handle map click to set location
    const handleMapClick = (event) => {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        
        // Update location state
        setUserLocation({ latitude, longitude });
        setOrder(prev => ({
            ...prev,
            latitude,
            longitude
        }));
        
        // Get address for the selected location
        getAddressFromCoordinates(latitude, longitude);
        
        // Update marker
        if (userMarker) userMarker.setMap(null);
        
        const marker = new window.google.maps.Marker({
            position: event.latLng,
            map: map,
            title: 'Selected Location',
            animation: window.google.maps.Animation.DROP
        });
        
        setUserMarker(marker);
        toast.success('Location selected!');
    };

    // Update item quantity in cart
    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = [...cart];
        updatedCart[index].quantity = newQuantity;
        updatedCart[index].totalPrice = updatedCart[index].price * newQuantity;
        // Note: This should update through your cart context
    };

    // Handle delivery option change
    const handleDeliveryOptionChange = (option) => {
        setOrder(prev => ({
            ...prev,
            deliveryOption: option
        }));
    };

    // Submit order
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Only validate location if delivery is selected
        if (order.deliveryOption === 'delivery' && !userLocation) {
            toast.error('Please select a delivery location on the map');
            return;
        }
        
        try {
            // If pickup is selected, remove location data
            const orderData = { ...order };
            if (order.deliveryOption === 'pickup') {
                orderData.latitude = null;
                orderData.longitude = null;
                orderData.deliveryAddress = '';
            }
            
            const result = await api.post('/customer/place-order', orderData);
            if (result.data.status) {
                toast.success(result.data.message);
                // Clear cart or redirect to confirmation page
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            
            {/* Header Navigation */}
            <header className="relative">
                <div className='flex items-center justify-between md:p-2 p-1 fixed right-0 left-0 bg-white dark:bg-gray-900 z-20 shadow-md'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <img className='w-11 h-11 md:w-16 md:h-16 dark:bg-white rounded-full' src={logo} alt="ConstracEase Logo" />
                        <div className='font-bold text-lg md:text-2xl md:px-2'>
                            <p>ConstracEase</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
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

                    {/* Desktop Search */}
                    <div className="relative max-w-sm hidden md:block">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full outline-none border border-gray-200 dark:border-gray-800 p-2 pl-10 rounded-3xl dark:bg-gray-900"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>

                    {/* Header Icons */}
                    <div className='flex gap-2 md:gap-5 items-center'>
                        {/* Cart Icon */}
                        <button
                            className="relative hidden md:block"
                            onClick={() => setCartOpen(true)}
                        >
                            <div className="w-10 h-10 flex items-center justify-center">
                                <ShoppingCartOutlinedIcon className="text-2xl" />
                            </div>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        {/* Notification Icon */}
                        <div className="relative hidden md:block">
                            <button className="w-10 h-10 flex items-center justify-center">
                                <NotificationsNoneIcon className="text-2xl" />
                            </button>
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                3
                            </span>
                        </div>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-1 md:p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded flex items-center"
                        >
                            {darkMode ? <LightMode className="text-xl md:text-2xl" /> : <DarkMode className="text-xl md:text-2xl" />}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className='md:hidden p-1'
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-10 pt-16">
                        <div className="flex flex-col p-5">
                            {/* Mobile Search */}
                            <div className="mb-6 mt-7">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full mt-2 outline-none border border-gray-200 dark:border-gray-800 p-3 pl-10 rounded-3xl dark:bg-gray-900"
                                />
                                <FaSearch className="absolute left-8 top-[9.1rem] transform -translate-y-1/2 text-gray-500" />
                            </div>

                            {/* Mobile Navigation */}
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

                            {/* Mobile Bottom Actions */}
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

                {/* Shopping Cart Modal */}
                {cartOpen && (
                    <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center md:justify-end">
                        <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full md:h-auto max-h-full overflow-y-auto shadow-xl md:mr-4 md:my-4 md:rounded-lg">
                            {/* Cart Header */}
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
                                {/* Map for Delivery Location */}
                                <div className="mb-4">
                                    <h3 className="font-medium mb-2">Delivery Options</h3>
                                    
                                    {/* Delivery Radio Options */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center">
                                            <input
                                                id="delivery-pickup"
                                                type="radio"
                                                name="deliveryOption"
                                                value="pickup"
                                                checked={order.deliveryOption === "pickup"}
                                                onChange={() => handleDeliveryOptionChange("pickup")}
                                                className="h-4 w-4 text-blue-600"
                                            />
                                            <label htmlFor="delivery-pickup" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                I'll pick up
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="delivery-delivery"
                                                type="radio"
                                                name="deliveryOption"
                                                value="delivery"
                                                checked={order.deliveryOption === "delivery"}
                                                onChange={() => handleDeliveryOptionChange("delivery")}
                                                className="h-4 w-4 text-blue-600"
                                            />
                                            <label htmlFor="delivery-delivery" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                Delivery to my location
                                            </label>
                                        </div>
                                    </div>

                                    {/* Show map only when delivery is selected */}
                                    {order.deliveryOption === "delivery" && (
                                        <>
                                            <div 
                                                ref={mapRef} 
                                                className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2"
                                            ></div>
                                            
                                            {/* Map loading state */}
                                            {isLoading && (
                                                <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-10">
                                                    <div className="flex flex-col items-center">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                                                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                                                            Loading map...
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Location Message */}
                                            <p className="text-sm text-gray-500 mb-2">
                                                {!userLocation ? 'Click on the map to select your delivery location or use "Find my location"' : 
                                                '✓ Location selected'}
                                            </p>
                                            
                                            {/* Display Selected Location */}
                                            {userLocation && locationAddress && (
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4 flex items-start">
                                                    <MapPin size={18} className="text-blue-500 mt-1 flex-shrink-0 mr-2" />
                                                    <div>
                                                        <h4 className="font-medium text-sm">Selected Location:</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{locationAddress}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Cart Items */}
                                {cart.length === 0 ? (
                                    <div className="text-center py-8">
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
                                    <form onSubmit={handleSubmit}>
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
                                                        <span
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-1 text-gray-500 hover:text-red-500 cursor-pointer"
                                                        >
                                                            <X size={16} />
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-12 gap-2 mt-2">
                                                        <div className="col-span-6 flex items-center">
                                                            <span
                                                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                                                className="p-1 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer"
                                                            >
                                                                <Minus size={14} />
                                                            </span>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                min="1"
                                                                onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                                                                className="w-full mx-1 p-1 text-center border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900"
                                                                readOnly
                                                            />
                                                            <span
                                                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                                                className="p-1 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer"
                                                            >
                                                                <Plus size={14} />
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="col-span-6 flex justify-end items-center">
                                                            <span className="font-medium">Birr {(item.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Cart Totals */}
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                            <div className="flex justify-between mb-2">
                                                <span>Subtotal</span>
                                                <span className="font-medium">Birr {cartTotal.toFixed(2)}</span>
                                            </div>
                                            {order.deliveryOption === 'delivery' && (
                                                <div className="flex justify-between mb-2">
                                                    <span>Delivery Fee</span>
                                                    <span className="font-medium">Birr 50.00</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between mb-4">
                                                <span className="font-bold">Total</span>
                                                <span className="font-bold">
                                                    Birr {(cartTotal + (order.deliveryOption === 'delivery' ? 50 : 0)).toFixed(2)}
                                                </span>
                                            </div>

                                            <button 
                                                type="submit"
                                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-md mb-2 transition-all"
                                                disabled={order.deliveryOption === 'delivery' && !userLocation}
                                            >
                                                {order.deliveryOption === 'delivery' && !userLocation 
                                                    ? 'Please Select Location'
                                                    : 'Order Now'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCartOpen(false)}
                                                className="w-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 py-2 px-4 rounded-md transition-all"
                                            >
                                                Continue Shopping
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Banner Section */}
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
    );
}

export default Header;