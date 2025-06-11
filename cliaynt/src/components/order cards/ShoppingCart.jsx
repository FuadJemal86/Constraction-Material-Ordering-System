import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, MapPin, Wrench, User } from 'lucide-react';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../CartContext";
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api';

function ShoppingCart({ onClose }) {
    // Core state management
    const { cart, removeItem, updateQuantity } = useCart();
    const navigator = useNavigate();

    // Map related state
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [userMarker, setUserMarker] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationAddress, setLocationAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Product stock state
    const [products, setProducts] = useState([]);

    // Order state with proper structure
    const [order, setOrder] = useState({
        supplierId: "",
        totalPrice: 0,
        latitude: null,
        longitude: null,
        deliveryOption: "pickup", // Default to pickup
        address: "",
        deliveryFee: 0
    });

    // Cart calculations
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = order.deliveryOption === 'delivery' ? 50 : 0;
    const finalTotal = cartTotal + deliveryFee;

    // Fetch product stock information
    useEffect(() => {
        const fetchProductsByIds = async () => {
            try {
                const productIds = cart.map(item => item.id);

                if (productIds.length === 0) {
                    setProducts([]);
                    return;
                }

                const response = await api.get('/customer/get-products-stock', {
                    params: { productIds: productIds.join(',') }
                });

                setProducts(response.data.data || []);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                toast.error("Failed to fetch product information");
            }
        };

        fetchProductsByIds();
    }, [cart]);

    // Effect to set supplierId from first cart item
    useEffect(() => {
        if (cart.length > 0) {
            setOrder(prev => ({
                ...prev,
                supplierId: cart[0].supplierId,
            }));
        }
    }, [cart]);

    // Effect to update total price and delivery fee when cart or delivery option changes
    useEffect(() => {
        setOrder(prev => ({
            ...prev,
            totalPrice: finalTotal,
            deliveryFee: deliveryFee
        }));
    }, [finalTotal, deliveryFee]);

    // Map initialization
    useEffect(() => {
        if (order.deliveryOption === "delivery" && mapRef.current) {
            loadGoogleMapsScript()
                .then(() => initializeMap())
                .catch(error => {
                    console.error("Failed to load map:", error);
                    toast.error("Failed to load Google Maps. Please refresh the page.");
                    setIsLoading(false);
                });
        }
    }, [order.deliveryOption]);

    // Load Google Maps API
    const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const apiKey = "AIzaSyBThb9ieJOIHzM_616ZKBE31ibU8yIDuIs"; // Replace with your actual API key
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
        setIsLoading(true);

        const defaultCenter = { lat: 9.145, lng: 40.4897 }; // Ethiopia center

        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 6,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });

        // Add location button
        const locationButton = document.createElement("button");
        locationButton.innerHTML = `<div style="background-color: #fff; border: 2px solid #fff; border-radius: 3px; 
                    box-shadow: 0 2px 6px rgba(0,0,0,.3); cursor: pointer; text-align: center; 
                    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-location-arrow" style="color: #1a73e8; font-size: 18px;"></i>
        </div>`;
        locationButton.classList.add("custom-map-control-button");
        locationButton.setAttribute("title", "Find my location");
        locationButton.type = "button";
        locationButton.addEventListener("click", getUserLocation);

        mapInstance.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

        // Add click event listener
        window.google.maps.event.addListener(mapInstance, 'click', handleMapClick);

        setMap(mapInstance);
        setIsLoading(false);
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
                        title: 'Your Location'
                    });

                    setUserMarker(newMarker);
                }

                setIsLoading(false);
                toast.success('Location found successfully!');
            },
            error => {
                console.error('Geolocation error:', error);
                toast.error('Location permission denied. Please enable it in your browser.');
                setIsLoading(false);
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
            title: 'Selected Location'
        });

        setUserMarker(marker);
        toast.success('Location selected!');
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
                    address: address
                }));
            } else {
                setLocationAddress("Address not found");
                setOrder(prev => ({
                    ...prev,
                    address: ""
                }));
            }
        });
    };

    // Handle delivery option change
    const handleDeliveryOptionChange = (option) => {
        setOrder(prev => ({
            ...prev,
            deliveryOption: option,
            // Reset location data when switching to pickup
            ...(option === 'pickup' && {
                latitude: null,
                longitude: null,
                address: ""
            })
        }));

        // Reset location states when switching to pickup
        if (option === 'pickup') {
            setUserLocation(null);
            setLocationAddress("");
            if (userMarker) {
                userMarker.setMap(null);
                setUserMarker(null);
            }
        }
    };

    // Get product stock for a specific item
    const getProductStock = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.stock : 0;
    };

    // Check if quantity can be increased
    const canIncreaseQuantity = (item) => {
        const stock = getProductStock(item.id);
        return item.quantity < stock;
    };

    // Handle quantity update with stock validation
    const handleQuantityUpdate = (index, newQuantity) => {
        const item = cart[index];
        const stock = getProductStock(item.id);

        if (newQuantity > stock) {
            toast.error(`Only ${stock} items available in stock`);
            return;
        }

        if (newQuantity < 1) {
            return;
        }

        updateQuantity(index, newQuantity);
    };

    // Submit order
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (order.deliveryOption === 'delivery' && !userLocation && !order.address.trim()) {
            toast.error('Please select a delivery location on the map or enter your address manually');
            return;
        }

        // Check stock for all items
        const stockIssues = cart.filter(item => {
            const stock = getProductStock(item.id);
            return item.quantity > stock;
        });

        if (stockIssues.length > 0) {
            toast.error('Some items exceed available stock. Please adjust quantities.');
            return;
        }

        try {
            const orderData = {
                supplierId: order.supplierId,
                totalPrice: order.totalPrice,
                deliveryOption: order.deliveryOption,
                deliveryFee: order.deliveryFee,
                products: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    supplierId: item.supplierId,
                }))
            };

            // Add location data only for delivery
            if (order.deliveryOption === 'delivery') {
                orderData.latitude = order.latitude;
                orderData.longitude = order.longitude;
                orderData.address = order.address.trim();
            } else {
                orderData.latitude = null;
                orderData.longitude = null;
                orderData.address = '';
            }

            const result = await api.post('/customer/place-order', orderData);

            if (result.data.status) {
                const transactionId = result.data.orders[0]?.transactionId;

                if (transactionId) {
                    toast.success(result.data.message);
                    navigator(`/payment-form/${transactionId}`);
                    onClose();
                } else {
                    toast.error('Transaction ID not received');
                }
            } else {
                toast.error(result.data.message);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                toast.error('Please sign in to place an order');
                navigator('/customer-sign-in');
            } else {
                toast.error(err.response?.data?.message || 'An error occurred while placing the order');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center md:justify-end">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full md:h-auto max-h-full overflow-y-auto shadow-xl md:mr-4 md:my-4 md:rounded-lg">
                {/* Cart Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900">
                    <h2 className="text-xl font-bold flex items-center">
                        <ShoppingCartOutlinedIcon className="mr-2" />
                        Your Cart ({cart.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    {/* Delivery Options */}
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
                                <div className="relative">
                                    <div
                                        ref={mapRef}
                                        className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2"
                                    ></div>

                                    {/* Map loading state */}
                                    {isLoading && (
                                        <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center rounded-lg">
                                            <div className="flex flex-col items-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium">
                                                    Loading map...
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Location Message */}
                                <p className="text-sm text-gray-500 mb-2">
                                    {!userLocation ? 'Click on the map to select your delivery location or use "Find my location"' :
                                        '✓ Location selected'}
                                </p>

                                {/* Manual Address Input */}
                                <div className="mb-3">
                                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                        Or manually enter your exact location:
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your exact delivery address"
                                        value={order.address}
                                        onChange={e => setOrder({ ...order, address: e.target.value })}
                                        className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900 text-sm"
                                    />
                                </div>

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
                                onClick={onClose}
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-md transition-all"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800 mb-4">
                                {cart.map((item, index) => {
                                    const stock = getProductStock(item.id);
                                    const isOutOfStock = stock === 0;
                                    const exceedsStock = item.quantity > stock;

                                    return (
                                        <div key={`${item.id}-${index}`} className="py-3">
                                            <div className="flex items-center mb-2">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
                                                    <Wrench className="text-gray-400" size={16} />
                                                </div>
                                                <div className="ml-3 flex-grow">
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <div className="text-xs text-gray-500">
                                                        Stock: {stock} available
                                                        {exceedsStock && (
                                                            <span className="text-red-500 ml-2">
                                                                (Exceeds available stock!)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1 text-gray-500 hover:text-red-500 cursor-pointer"
                                                >
                                                    <X size={16} />
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 mt-2">
                                                {/* Quantity Controls */}
                                                <div className="col-span-6 flex items-center">
                                                    {/* Minus Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityUpdate(index, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-1 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus size={14} />
                                                    </button>

                                                    {/* Quantity Display */}
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        min="1"
                                                        max={stock}
                                                        onChange={(e) => {
                                                            const newQuantity = parseInt(e.target.value) || 1;
                                                            handleQuantityUpdate(index, newQuantity);
                                                        }}
                                                        className={`w-full mx-1 p-1 text-center border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-900 text-sm ${exceedsStock ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''
                                                            }`}
                                                    />

                                                    {/* Plus Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityUpdate(index, item.quantity + 1)}
                                                        disabled={!canIncreaseQuantity(item) || isOutOfStock}
                                                        className="p-1 bg-gray-100 dark:bg-gray-800 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="col-span-6 flex justify-end items-center">
                                                    <span className="font-medium">
                                                        Birr {(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
                                        <span className="font-medium">Birr {deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between mb-4">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold">
                                        Birr {finalTotal.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-md mb-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={
                                        (order.deliveryOption === 'delivery' && !userLocation && !order.address.trim()) ||
                                        cart.some(item => item.quantity > getProductStock(item.id))
                                    }
                                >
                                    {order.deliveryOption === 'delivery' && !userLocation && !order.address.trim()
                                        ? 'Please Select Location'
                                        : cart.some(item => item.quantity > getProductStock(item.id))
                                            ? 'Check Stock Availability'
                                            : 'Order Now'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
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
    );
}

export default ShoppingCart;