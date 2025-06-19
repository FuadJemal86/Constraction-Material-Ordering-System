import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, MapPin, Wrench, User, AlertCircle, Truck } from 'lucide-react';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../CartContext";
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api';

function ShoppingCart({ onClose }) {
    // Ethiopia boundary definition
    const ETHIOPIA_BOUNDS = {
        north: 14.8942,   // Northern boundary
        south: 3.4024,    // Southern boundary  
        east: 47.9823,    // Eastern boundary
        west: 32.9975     // Western boundary
    };

    // Function to check if coordinates are within Ethiopia
    const isLocationInEthiopia = (lat, lng) => {
        return (
            lat >= ETHIOPIA_BOUNDS.south &&
            lat <= ETHIOPIA_BOUNDS.north &&
            lng >= ETHIOPIA_BOUNDS.west &&
            lng <= ETHIOPIA_BOUNDS.east
        );
    };

    // Address validation for Ethiopia
    const validateEthiopianAddress = (address) => {
        const ethiopianKeywords = [
            'ethiopia', 'addis ababa', 'dire dawa', 'mekelle', 'gondar', 'hawassa',
            'bahir dar', 'dessie', 'jimma', 'jijiga', 'shashamane', 'arba minch',
            'nekemte', 'bishoftu', 'debre markos', 'gambela', 'adama', 'awasa'
        ];

        const addressLower = address.toLowerCase();
        return ethiopianKeywords.some(keyword => addressLower.includes(keyword));
    };

    // Core state management
    const { cart, removeItem, updateQuantity } = useCart();
    const navigate = useNavigate();

    // Map related state
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [userMarker, setUserMarker] = useState(null);
    const [supplierMarker, setSupplierMarker] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [supplierLocation, setSupplierLocation] = useState(null);
    const [locationAddress, setLocationAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [deliveryDistance, setDeliveryDistance] = useState(null);

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

    // Get supplier delivery info from cart data with correct property names
    const getSupplierDeliveryInfo = () => {
        if (cart.length === 0) {
            return {
                offersDelivery: false,
                deliveryPricePerKm: 0,
                latitude: null,
                longitude: null
            };
        }

        // Get delivery info from the first cart item (assuming all items are from same supplier)
        const firstItem = cart[0];
        return {
            offersDelivery: firstItem.offersDelivery || false,
            deliveryPricePerKm: firstItem.deliveryPricePerKm || 0,
            latitude: firstItem.latitude || null,
            longitude: firstItem.longitude || null
        };
    };

    const supplierDeliveryInfo = getSupplierDeliveryInfo();
    const supplierOffersDelivery = supplierDeliveryInfo.offersDelivery;
    const deliveryPricePerKm = supplierDeliveryInfo.deliveryPricePerKm;

    // Calculate delivery fee based on distance and supplier's price per km
    const calculateDeliveryFee = () => {
        if (order.deliveryOption !== 'delivery' || !deliveryDistance || !deliveryPricePerKm) {
            return 0;
        }
        return deliveryDistance * deliveryPricePerKm;
    };

    const deliveryFee = calculateDeliveryFee();
    const finalTotal = cartTotal; // Delivery fee is paid in cash, not added to total

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

    // Fetch supplier location if not available in cart data
    useEffect(() => {
        const fetchSupplierLocation = async () => {
            if (cart.length > 0 && !supplierDeliveryInfo.latitude && !supplierDeliveryInfo.longitude) {
                try {
                    // Fetch supplier details to get location
                    const supplierId = cart[0].supplierId;
                    const response = await api.get(`/customer/supplier/${supplierId}`);

                    if (response.data && response.data.data) {
                        const supplier = response.data.data;
                        setSupplierLocation({
                            latitude: supplier.latitude,
                            longitude: supplier.longitude
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch supplier location:", error);
                    // If we can't get supplier location, disable delivery
                    if (order.deliveryOption === 'delivery') {
                        toast.error("Cannot load supplier location for delivery");
                        setOrder(prev => ({ ...prev, deliveryOption: 'pickup' }));
                    }
                }
            } else if (supplierDeliveryInfo.latitude && supplierDeliveryInfo.longitude) {
                setSupplierLocation({
                    latitude: supplierDeliveryInfo.latitude,
                    longitude: supplierDeliveryInfo.longitude
                });
            } else {
                setSupplierLocation(null);
            }
        };

        fetchSupplierLocation();
    }, [cart, supplierDeliveryInfo.latitude, supplierDeliveryInfo.longitude]);

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
        setOrder(prev => ({
            ...prev,
            totalPrice: finalTotal,
            deliveryFee: deliveryFee
        }));
    }, [finalTotal, deliveryFee]);

    // Map initialization effect
    useEffect(() => {
        if (order.deliveryOption === "delivery" && supplierOffersDelivery && !mapLoaded) {
            loadGoogleMapsScript()
                .then(() => {
                    initializeMap();
                    setMapLoaded(true);
                })
                .catch(error => {
                    console.error("Failed to load map:", error);
                    toast.error("Failed to load Google Maps. Please refresh the page.");
                    setIsLoading(false);
                });
        }
    }, [order.deliveryOption, supplierOffersDelivery, mapLoaded]);

    // Calculate distance between two points (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    // Update delivery distance when locations change
    useEffect(() => {
        if (userLocation && supplierLocation && order.deliveryOption === 'delivery') {
            const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                supplierLocation.latitude,
                supplierLocation.longitude
            );
            setDeliveryDistance(Math.round(distance * 100) / 100); // Round to 2 decimal places
        } else {
            setDeliveryDistance(null);
        }
    }, [userLocation, supplierLocation, order.deliveryOption]);

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

    // Initialize the map with Ethiopia restrictions
    const initializeMap = () => {
        if (!mapRef.current || !window.google) return;

        setIsLoading(true);

        // Default center (Ethiopia)
        const defaultCenter = supplierLocation || { lat: 9.145, lng: 40.4897 };

        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: supplierLocation ? 12 : 6,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            // Restrict map bounds to Ethiopia
            restriction: {
                latLngBounds: {
                    north: ETHIOPIA_BOUNDS.north,
                    south: ETHIOPIA_BOUNDS.south,
                    east: ETHIOPIA_BOUNDS.east,
                    west: ETHIOPIA_BOUNDS.west
                },
                strictBounds: true
            },
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });

        // Add supplier marker if location is available
        if (supplierLocation) {
            const supplierMarkerInstance = new window.google.maps.Marker({
                position: {
                    lat: supplierLocation.latitude,
                    lng: supplierLocation.longitude
                },
                map: mapInstance,
                title: 'Supplier Location',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 0C6.716 0 0 6.716 0 15c0 15 15 30 15 30s15-15 15-30c0-8.284-6.716-15-15-15z" fill="#10B981"/>
                            <circle cx="15" cy="15" r="8" fill="white"/>
                            <circle cx="15" cy="15" r="4" fill="#10B981"/>
                        </svg>
                    `),
                    scaledSize: new window.google.maps.Size(30, 30),
                    anchor: new window.google.maps.Point(15, 30)
                }
            });
            setSupplierMarker(supplierMarkerInstance);
        }

        // Add click event listener to map with Ethiopia validation
        mapInstance.addListener('click', (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Check if location is within Ethiopia
            if (!isLocationInEthiopia(lat, lng)) {
                toast.error('Delivery is only available within Ethiopia. Please select a location within the country.');
                return;
            }

            setLocationOnMap(lat, lng, mapInstance);
        });

        setMap(mapInstance);
        setIsLoading(false);

        // Try to get user's current location on map load
        getCurrentLocation(mapInstance);
    };

    // Get user's current location with Ethiopia validation
    const getCurrentLocation = (mapInstance = map) => {
        if (!navigator.geolocation) {
            console.log('Geolocation not supported');
            return;
        }

        setIsLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Check if user's location is within Ethiopia
                if (!isLocationInEthiopia(lat, lng)) {
                    toast.error('Your current location is outside Ethiopia. Please manually select a location within Ethiopia for delivery.');
                    setIsLoading(false);
                    return;
                }

                if (mapInstance) {
                    mapInstance.setCenter({ lat, lng });
                    mapInstance.setZoom(15);
                    setLocationOnMap(lat, lng, mapInstance);
                    toast.success('Current location found within Ethiopia!');
                }
                setIsLoading(false);
            },
            (error) => {
                console.log('Geolocation error:', error);
                toast.error('Could not get your location. Please select your delivery location manually on the map.');
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    // Set location on map with marker and address (Ethiopia validation)
    const setLocationOnMap = (lat, lng, mapInstance = map) => {
        // Double-check Ethiopia boundaries
        if (!isLocationInEthiopia(lat, lng)) {
            toast.error('Selected location is outside Ethiopia. Delivery is only available within Ethiopia.');
            return;
        }

        // Clear existing user marker
        if (userMarker) {
            userMarker.setMap(null);
        }

        // Calculate distance to supplier if supplier location exists
        let distance = null;
        if (supplierLocation) {
            distance = calculateDistance(
                lat, lng,
                supplierLocation.latitude,
                supplierLocation.longitude
            );
        }

        // Check if distance is within allowed range (3-7km)
        if (distance !== null) {
            if (distance < 3) {
                toast.error('Delivery location must be at least 3km from supplier');
                return;
            }
            if (distance > 7) {
                toast.error('Delivery location must be within 7km from supplier');
                return;
            }
        }

        // Create new user marker
        const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstance,
            draggable: true,
            title: 'Delivery Location',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.716 0 0 6.716 0 15c0 15 15 30 15 30s15-15 15-30c0-8.284-6.716-15-15-15z" fill="#FF6B6B"/>
                        <circle cx="15" cy="15" r="8" fill="white"/>
                        <circle cx="15" cy="15" r="4" fill="#FF6B6B"/>
                    </svg>
                `),
                scaledSize: new window.google.maps.Size(30, 30),
                anchor: new window.google.maps.Point(15, 30)
            }
        });

        // Add drag event listener with Ethiopia validation
        marker.addListener('dragend', (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();

            // Check if dragged location is still within Ethiopia
            if (!isLocationInEthiopia(newLat, newLng)) {
                toast.error('Delivery location must be within Ethiopia. Please select a location within the country.');
                // Reset marker to previous valid position
                marker.setPosition({ lat, lng });
                return;
            }

            // Check distance constraints on drag
            if (supplierLocation) {
                const newDistance = calculateDistance(
                    newLat, newLng,
                    supplierLocation.latitude,
                    supplierLocation.longitude
                );

                if (newDistance < 3 || newDistance > 7) {
                    toast.error('Delivery location must be between 3-7km from supplier');
                    // Reset marker to previous valid position
                    marker.setPosition({ lat, lng });
                    return;
                }
            }

            updateLocationData(newLat, newLng);
            getAddressFromCoordinates(newLat, newLng);
        });

        setUserMarker(marker);
        updateLocationData(lat, lng);
        getAddressFromCoordinates(lat, lng);

        if (distance !== null) {
            toast.success(`Location selected within Ethiopia! Distance: ${distance.toFixed(2)}km`);
        } else {
            toast.success('Location selected successfully within Ethiopia!');
        }
    };

    // Update location data in state
    const updateLocationData = (lat, lng) => {
        setUserLocation({ latitude: lat, longitude: lng });
        setOrder(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    // Get human-readable address from coordinates using OpenStreetMap
    const getAddressFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            const data = await response.json();
            const address = data.display_name || 'Selected location';

            setLocationAddress(address);
            setOrder(prev => ({
                ...prev,
                address: address
            }));
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            setLocationAddress("Could not resolve address");
        }
    };

    // Handle manual location button click
    const handleFindMyLocation = () => {
        if (!map) {
            toast.error('Map not loaded yet');
            return;
        }
        getCurrentLocation(map);
    };

    // Handle delivery option change
    const handleDeliveryOptionChange = (option) => {
        // Check if supplier offers delivery
        if (option === 'delivery' && !supplierOffersDelivery) {
            toast.error('This supplier does not offer delivery service');
            return;
        }

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
            setDeliveryDistance(null);
            if (userMarker) {
                userMarker.setMap(null);
                setUserMarker(null);
            }
        }
    };

    // Handle manual address input with Ethiopia validation
    const handleAddressChange = (e) => {
        const address = e.target.value;
        setOrder(prev => ({
            ...prev,
            address: address
        }));
        setLocationAddress(address);

        // Warn if address doesn't seem to be in Ethiopia
        if (address.length > 10 && !validateEthiopianAddress(address)) {
            toast.warning('Please ensure your address is within Ethiopia for delivery service.');
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
        if (order.deliveryOption === 'delivery') {
            if (!supplierOffersDelivery) {
                toast.error('This supplier does not offer delivery service');
                return;
            }

            if (!userLocation && !order.address.trim()) {
                toast.error('Please select a delivery location on the map or enter your address manually');
                return;
            }

            if (deliveryDistance !== null && (deliveryDistance < 3 || deliveryDistance > 7)) {
                toast.error('Delivery location must be between 3-7km from supplier');
                return;
            }
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

        // Show loading state
        const loadingToast = toast.loading('Placing your order...');

        try {
            const orderData = {
                supplierId: order.supplierId,
                totalPrice: order.totalPrice,
                deliveryOption: order.deliveryOption,
                deliveryFee: 0, // Delivery fee is paid in cash
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
                orderData.deliveryDistance = deliveryDistance;
                orderData.deliveryPricePerKm = deliveryPricePerKm;
                orderData.cashDeliveryFee = deliveryFee; // Track cash delivery fee
            } else {
                orderData.latitude = null;
                orderData.longitude = null;
                orderData.address = '';
                orderData.deliveryDistance = null;
                orderData.deliveryPricePerKm = null;
                orderData.cashDeliveryFee = 0;
            }

            const result = await api.post('/customer/place-order', orderData);

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            if (result.data && result.data.status) {
                // Try to get transaction ID from different possible locations
                let transactionId = null;

                if (result.data.transactionId) {
                    transactionId = result.data.transactionId;
                } else if (result.data.orders && result.data.orders.length > 0) {
                    transactionId = result.data.orders[0].transactionId;
                } else if (result.data.order && result.data.order.transactionId) {
                    transactionId = result.data.order.transactionId;
                } else if (result.data.data && result.data.data.transactionId) {
                    transactionId = result.data.data.transactionId;
                }

                if (transactionId) {
                    const successMessage = order.deliveryOption === 'delivery'
                        ? `Order placed successfully! Delivery will be paid in cash to the driver.`
                        : 'Order placed successfully!';

                    toast.success(successMessage);
                    onClose();
                    setTimeout(() => {
                        navigate(`/payment-form/${transactionId}`);
                    }, 500);
                } else {
                    toast.error('Order placed but payment link not available');
                    onClose();
                    setTimeout(() => {
                        navigate('/orders');
                    }, 1000);
                }
            } else {
                toast.error(result.data?.message || 'Failed to place order');
            }

        } catch (err) {
            console.error('Order submission error:', err);
            toast.dismiss(loadingToast);

            if (err.response?.status === 401) {
                toast.error('Please sign in to place an order');
                setTimeout(() => {
                    navigate('/customer-sign-in');
                }, 1000);
            } else {
                const errorMessage = err.response?.data?.message || 'An error occurred while placing the order';
                toast.error(errorMessage);
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
                        <h3 className="font-medium mb-3">Delivery Options</h3>

                        {/* Supplier Delivery Info */}
                        {cart.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <Truck size={16} className="text-blue-600 dark:text-blue-400 mr-2" />
                                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                        Supplier Delivery Info
                                    </span>
                                </div>
                                {supplierOffersDelivery ? (
                                    <div className="text-sm text-blue-700 dark:text-blue-300">
                                        <p>✓ Delivery available</p>
                                        <p>Price: Birr {deliveryPricePerKm}/km</p>
                                        <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                                            * Delivery fee paid in cash to driver
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-sm text-blue-700 dark:text-blue-300">
                                        <p>✗ This supplier does not offer delivery</p>
                                        <p>Pickup only</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Delivery Radio Options */}
                        <div className="flex flex-col gap-3 mb-4">
                            <div className="flex items-center">
                                <input
                                    id="delivery-pickup"
                                    type="radio"
                                    name="deliveryOption"
                                    value="pickup"
                                    checked={order.deliveryOption === "pickup"}
                                    onChange={() => handleDeliveryOptionChange("pickup")}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="delivery-pickup" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                    I'll pick up (Free)
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
                                    disabled={!supplierOffersDelivery}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                />
                                <label htmlFor="delivery-delivery" className={`ml-2 text-sm cursor-pointer ${supplierOffersDelivery
                                    ? 'text-gray-700 dark:text-gray-300'
                                    : 'text-gray-400 dark:text-gray-600'
                                    }`}>
                                    Delivery to my location
                                    {supplierOffersDelivery ? (
                                        <span className="text-orange-600 dark:text-orange-400">
                                            {deliveryDistance ? ` (Birr ${deliveryFee.toFixed(2)} - Cash)` : ' (Price calculated on location)'}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400"> (Not available)</span>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Show map and location controls only when delivery is selected and offered */}
                        {order.deliveryOption === "delivery" && supplierOffersDelivery && (
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Select Delivery Location
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={handleFindMyLocation}
                                        className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Finding...' : 'Find My Location'}
                                    </button>
                                </div>

                                <div className="relative mb-3">
                                    <div
                                        ref={mapRef}
                                        className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"
                                    ></div>

                                    {/* Map loading overlay */}
                                    {isLoading && (
                                        <div className="absolute inset-0 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center rounded-lg">
                                            <div className="flex flex-col items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Map instructions */}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center">
                                    Click on the map to select your delivery location.
                                    <span className="block">Green marker = Supplier, Red marker = Your location</span>
                                </p>

                                {/* Distance and Fee Display */}
                                {deliveryDistance && (
                                    <div className="mb-3 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-orange-700 dark:text-orange-300">
                                                Distance: {deliveryDistance}km
                                            </span>
                                            <span className="font-medium text-orange-800 dark:text-orange-200">
                                                Cash Fee: Birr {deliveryFee.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                            * This amount will be paid in cash to the driver upon delivery
                                        </p>
                                    </div>
                                )}

                                {/* Manual Address Input */}
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Or enter your address manually:
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your delivery address"
                                        value={order.address}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md dark:bg-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Selected Location Display */}
                                {userLocation && locationAddress && (
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-md flex items-start">
                                        <MapPin size={16} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0 mr-2" />
                                        <div className="flex-1">
                                            <h5 className="text-sm font-medium text-green-800 dark:text-green-200">
                                                Selected Location:
                                            </h5>
                                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                                {locationAddress}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                                                    <h3 className="font-medium text-sm">{item.name}</h3>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Stock: {stock} available
                                                        {exceedsStock && (
                                                            <span className="text-red-500 ml-2">
                                                                (Exceeds stock!)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityUpdate(index, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>

                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        min="1"
                                                        max={stock}
                                                        onChange={(e) => {
                                                            const newQuantity = parseInt(e.target.value) || 1;
                                                            handleQuantityUpdate(index, newQuantity);
                                                        }}
                                                        className={`w-16 px-2 py-1 text-center border rounded-md text-sm dark:bg-gray-900 dark:text-white ${exceedsStock
                                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                            : 'border-gray-200 dark:border-gray-600'
                                                            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityUpdate(index, item.quantity + 1)}
                                                        disabled={!canIncreaseQuantity(item) || isOutOfStock}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <span className="font-medium text-sm">
                                                        Birr {(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Cart Totals */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-medium">Birr {cartTotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2">
                                    <span>Total</span>
                                    <span>Birr {finalTotal.toFixed(2)}</span>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={
                                            (order.deliveryOption === 'delivery' && !userLocation && !order.address.trim()) ||
                                            cart.some(item => item.quantity > getProductStock(item.id))
                                        }
                                    >
                                        {order.deliveryOption === 'delivery' && !userLocation && !order.address.trim()
                                            ? 'Please Select Location'
                                            : cart.some(item => item.quantity > getProductStock(item.id))
                                                ? 'Check Stock Availability'
                                                : 'Place Order'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 px-4 rounded-md transition-all"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;