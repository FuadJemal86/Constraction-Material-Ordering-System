import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, MapPin, Wrench, User, AlertCircle, Truck } from 'lucide-react';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../CartContext";
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api';


const ImageViewer = ({ item }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mainImageError, setMainImageError] = useState(false);

    const getProductImages = (item) => {
        const images = [];
        if (item.image) images.push(`${api.defaults.baseURL}/images/${item.image}`);
        if (item.image1) images.push(`${api.defaults.baseURL}/images/${item.image1}`);
        if (item.image2) images.push(`${api.defaults.baseURL}/images/${item.image2}`);
        if (item.image3) images.push(`${api.defaults.baseURL}/images/${item.image3}`);
        return images;
    };

    const productImages = getProductImages(item);

    // Find first working image for main display
    const getFirstWorkingImage = () => {
        if (!productImages || productImages.length === 0) return null;
        return productImages[0]; // You can add logic to test each image if needed
    };

    const firstImage = getFirstWorkingImage();

    const handleImageError = () => {
        setMainImageError(true);
    };

    const openModal = () => {
        if (productImages && productImages.length > 0) {
            setShowModal(true);
            setCurrentImageIndex(0);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev < productImages.length - 1 ? prev + 1 : 0
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : productImages.length - 1
        );
    };

    return (
        <>
            {/* Main Image Display - Responsive */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 relative group">
                {firstImage && !mainImageError ? (
                    <>
                        <img
                            src={firstImage.startsWith('http')
                                ? firstImage
                                : `http://localhost:3032/image/${firstImage}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                        />
                        {/* View All Button - appears on hover */}
                        {productImages.length > 1 && (
                            <button
                                onClick={openModal}
                                className="absolute inset-0 bg-black/50 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                            >
                                <span className="hidden sm:inline">View All ({productImages.length})</span>
                                <span className="sm:hidden">+{productImages.length}</span>
                            </button>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Wrench size={16} className="sm:size-6" />
                    </div>
                )}
            </div>

            {/* Modal for viewing all images - Responsive */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xs sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate pr-2">
                                {item.name} - Images
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full flex-shrink-0"
                            >
                                <X size={16} className="sm:size-5" />
                            </button>
                        </div>

                        {/* Main Image Display */}
                        <div className="relative">
                            <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <img
                                    src={productImages[currentImageIndex].startsWith('http')
                                        ? productImages[currentImageIndex]
                                        : `http://localhost:3032/image/${productImages[currentImageIndex]}`}
                                    alt={`${item.name} - Image ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-full h-full hidden items-center justify-center text-gray-400">
                                    <Wrench size={32} className="sm:size-12" />
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            {productImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                        <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="15,18 9,12 15,6"></polyline>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                        <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="9,18 15,12 9,6"></polyline>
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                                {currentImageIndex + 1} / {productImages.length}
                            </div>
                        </div>

                        {/* Thumbnail Navigation - Responsive */}
                        {productImages.length > 1 && (
                            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                                    {productImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex
                                                ? 'border-blue-500'
                                                : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                        >
                                            <img
                                                src={img.startsWith('http')
                                                    ? img
                                                    : `http://localhost:3032/images/${img}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="w-full h-full hidden items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-700">
                                                <Wrench size={8} className="sm:size-3" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

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

    // Function to get all available images for a product
    const getProductImages = (item) => {
        const images = [];
        if (item.image) images.push(`http://localhost:3032/images/${item.image}`);
        if (item.image1) images.push(`http://localhost:3032/images/${item.image1}`);
        if (item.image2) images.push(`http://localhost:3032/images/${item.image2}`);
        if (item.image3) images.push(`http://localhost:3032/images/${item.image3}`);
        return images;
    };

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
        <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-2 md:p-4">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto shadow-xl md:rounded-lg">
                {/* Cart Header */}
                <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                    <h2 className="text-xl md:text-2xl font-bold flex items-center">
                        <ShoppingCartOutlinedIcon className="mr-2 md:mr-3" style={{ fontSize: '1.75rem' }} />
                        Your Cart ({cart.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                        <X size={20} className="md:w-6 md:h-6" />
                    </button>
                </div>

                <div className="p-4 md:p-6">
                    {/* Delivery Options */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-3 md:mb-4 text-lg">Delivery Options</h3>

                        {/* Supplier Delivery Info */}
                        {cart.length > 0 && (
                            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="flex items-center mb-2 md:mb-3">
                                    <Truck size={18} className="text-blue-600 dark:text-blue-400 mr-2 md:mr-3" />
                                    <span className="font-medium text-blue-800 dark:text-blue-200 text-sm md:text-base">
                                        Supplier Delivery Info
                                    </span>
                                </div>
                                {supplierOffersDelivery ? (
                                    <div className="text-blue-700 dark:text-blue-300 text-sm">
                                        <p className="flex items-center mb-1">
                                            <span className="text-green-600 mr-2">✓</span>
                                            Delivery available
                                        </p>
                                        <p className="mb-1">Price: Birr {deliveryPricePerKm}/km</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                            * Delivery fee paid in cash to driver
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-blue-700 dark:text-blue-300 text-sm">
                                        <p className="flex items-center mb-1">
                                            <span className="text-red-600 mr-2">✗</span>
                                            This supplier does not offer delivery
                                        </p>
                                        <p>Pickup only</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Delivery Radio Options */}
                        <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="flex items-center">
                                <input
                                    id="delivery-pickup"
                                    type="radio"
                                    name="deliveryOption"
                                    value="pickup"
                                    checked={order.deliveryOption === "pickup"}
                                    onChange={() => handleDeliveryOptionChange("pickup")}
                                    className="h-4 w-4 md:h-5 md:w-5 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="delivery-pickup" className="ml-2 md:ml-3 text-gray-700 dark:text-gray-300 cursor-pointer text-sm md:text-base">
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
                                    className="h-4 w-4 md:h-5 md:w-5 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                />
                                <label htmlFor="delivery-delivery" className="ml-2 md:ml-3 text-gray-700 dark:text-gray-300 cursor-pointer text-sm md:text-base">
                                    Deliver to me
                                    {supplierOffersDelivery && deliveryPricePerKm > 0 && (
                                        <span className="text-xs md:text-sm text-gray-500 ml-1">
                                            (Birr {deliveryPricePerKm}/km - paid in cash)
                                        </span>
                                    )}
                                    {!supplierOffersDelivery && (
                                        <span className="text-xs md:text-sm text-red-500 ml-1">(Not available)</span>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Delivery Distance and Fee Display */}
                        {order.deliveryOption === "delivery" && deliveryDistance && (
                            <div className="mb-3 md:mb-4 p-2 md:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center text-xs md:text-sm gap-1 md:gap-0">
                                    <span className="text-green-700 dark:text-green-300">
                                        Distance: {deliveryDistance}km
                                    </span>
                                    <span className="text-green-700 dark:text-green-300 font-medium">
                                        Delivery Fee: Birr {deliveryFee.toFixed(2)} (cash payment)
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Map Container for Delivery */}
                        {order.deliveryOption === "delivery" && supplierOffersDelivery && (
                            <div className="mb-4 md:mb-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 md:mb-4 gap-2 md:gap-0">
                                    <h4 className="font-medium text-sm md:text-base">Select Delivery Location</h4>
                                    <button
                                        onClick={handleFindMyLocation}
                                        className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-xs md:text-sm"
                                        disabled={isLoading}
                                    >
                                        <MapPin size={14} className="md:w-4 md:h-4" />
                                        {isLoading ? 'Loading...' : 'Find My Location'}
                                    </button>
                                </div>

                                {/* Map */}
                                <div
                                    ref={mapRef}
                                    className="w-full h-48 md:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 md:mb-4"
                                />

                                {/* Manual Address Input */}
                                <div className="mb-3 md:mb-4">
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                                        Or enter your address manually:
                                    </label>
                                    <input
                                        type="text"
                                        value={locationAddress}
                                        onChange={handleAddressChange}
                                        placeholder="Enter your delivery address in Ethiopia..."
                                        className="w-full px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>

                                {/* Location Info */}
                                {userLocation && (
                                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 md:p-3 rounded-lg">
                                        <p className="flex items-center">
                                            <MapPin size={14} className="mr-1 md:mr-2" />
                                            Selected Location: {locationAddress || 'Loading address...'}
                                        </p>
                                        {deliveryDistance && (
                                            <p className="mt-1">
                                                Distance from supplier: {deliveryDistance}km
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Delivery Instructions */}
                                <div className="mt-3 md:mt-4 p-2 md:p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="flex items-start">
                                        <AlertCircle size={14} className="text-yellow-600 dark:text-yellow-400 mr-1 md:mr-2 mt-0.5" />
                                        <div className="text-xs md:text-sm text-yellow-700 dark:text-yellow-300">
                                            <p className="font-medium mb-1">Delivery Guidelines:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs">
                                                <li>Delivery available only within Ethiopia</li>
                                                <li>Delivery fee paid in cash to driver</li>
                                                <li>Click on map or drag marker to set exact location</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart Items */}
                    {cart.length === 0 ? (
                        <div className="text-center py-8 md:py-12">
                            <ShoppingCartOutlinedIcon style={{ fontSize: '3rem' }} className="text-gray-400 mb-3 md:mb-4" />
                            <p className="text-gray-500 text-base md:text-lg mb-3 md:mb-4">Your cart is empty</p>
                            <Link
                                to="/products"
                                className="inline-block px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items List */}
                            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                                {cart.map((item, index) => {
                                    const productImages = getProductImages(item);
                                    const stock = getProductStock(item.id);

                                    return (
                                        <div key={index} className="flex items-center gap-2 md:gap-4 p-2 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            {/* Product Image */}
                                            <ImageViewer item={item} />


                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm md:text-base">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                                    Birr {item.price.toFixed(2)} each
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    Stock: {stock} available
                                                </p>
                                                {item.quantity > stock && (
                                                    <p className="text-xs text-red-500 mt-0.5">
                                                        ⚠️ Exceeds available stock
                                                    </p>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-1 md:gap-2">
                                                <button
                                                    onClick={() => handleQuantityUpdate(index, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-0.5 md:p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Minus size={14} className="md:w-4 md:h-4" />
                                                </button>
                                                <span className="w-6 md:w-8 text-center font-medium text-sm md:text-base">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityUpdate(index, item.quantity + 1)}
                                                    disabled={!canIncreaseQuantity(item)}
                                                    className="p-0.5 md:p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={!canIncreaseQuantity(item) ? `Only ${stock} items available` : ''}
                                                >
                                                    <Plus size={14} className="md:w-4 md:h-4" />
                                                </button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right min-w-[70px] md:min-w-[80px]">
                                                <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                                                    Birr {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="p-1 md:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                            >
                                                <X size={14} className="md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 md:pt-6">
                                <div className="space-y-2 mb-3 md:mb-4">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm md:text-base">
                                        <span>Subtotal ({cart.length} items):</span>
                                        <span>Birr {cartTotal.toFixed(2)}</span>
                                    </div>
                                    {order.deliveryOption === 'delivery' && deliveryFee > 0 && (
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm md:text-base">
                                            <span>Delivery Fee (cash payment):</span>
                                            <span>Birr {deliveryFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base md:text-lg font-semibold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
                                        <span>Online Payment Total:</span>
                                        <span>Birr {finalTotal.toFixed(2)}</span>
                                    </div>
                                    {order.deliveryOption === 'delivery' && deliveryFee > 0 && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                            + Birr {deliveryFee.toFixed(2)} delivery fee (paid in cash to driver)
                                        </p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 md:px-6 md:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm md:text-base"
                                    >
                                        Continue Shopping
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                    >
                                        {isLoading ? 'Processing...' : `Place Order - Birr ${finalTotal.toFixed(2)}`}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShoppingCart;