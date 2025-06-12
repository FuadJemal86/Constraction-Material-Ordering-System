import React, { useState, useEffect, useRef } from 'react';
import logo from '../../images/jejan.svg';
import banner from '../../images/login banner.jpg';
import api from '../../api';
import { Toaster, toast } from 'react-hot-toast';
import { Notyf } from 'notyf';
import { Link, useNavigate } from 'react-router-dom';
import 'notyf/notyf.min.css';

function SupplierSignUp() {
    const notyf = new Notyf();
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [showMap, setShowMap] = useState(false);

    // Supplier state with form fields
    const [supplier, setSupplier] = useState({
        companyName: "",
        email: "",
        phone: "",
        address: "",
        tinNumber: "",
        licenseNumber: "",
        password: "",
        coordinates: {
            lat: null,
            lng: null
        }
    });

    const [agree, setAgree] = useState(false);
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const [locationStatus, setLocationStatus] = useState('');

    // Initialize map when showMap becomes true
    useEffect(() => {
        if (showMap && mapRef.current && !map) {
            // Default center (Ethiopia coordinates)
            const defaultCenter = { lat: 9.145, lng: 40.489 };

            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: defaultCenter,
                zoom: 6,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            });

            setMap(mapInstance);

            // Add click listener to the map
            mapInstance.addListener('click', (event) => {
                placeMarker(event.latLng, mapInstance);
                reverseGeocode(event.latLng);
            });

            // If we already have coordinates, place marker there
            if (supplier.coordinates.lat && supplier.coordinates.lng) {
                const position = new window.google.maps.LatLng(
                    supplier.coordinates.lat,
                    supplier.coordinates.lng
                );
                placeMarker(position, mapInstance);
                mapInstance.setCenter(position);
                mapInstance.setZoom(15);
            }
        }
    }, [showMap, mapRef, map, supplier.coordinates]);

    // Function to place a marker on the map
    const placeMarker = (location, mapInstance) => {
        if (marker) marker.setMap(null);

        const newMarker = new window.google.maps.Marker({
            position: location,
            map: mapInstance,
            animation: window.google.maps.Animation.DROP
        });

        setMarker(newMarker);
        mapInstance.setCenter(location);
        mapInstance.setZoom(18);

        setSupplier((prev) => ({
            ...prev,
            coordinates: { lat: location.lat(), lng: location.lng() }
        }));
    };

    // Function to get address from coordinates (reverse geocoding)
    const reverseGeocode = async (latLng) => {
        try {
            setLocationStatus('Getting address...');
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng.lat()}&lon=${latLng.lng()}`
            );

            const data = await response.json();
            const address = data.display_name || 'Selected location';

            setSupplier({
                ...supplier,
                address: address,
                coordinates: {
                    lat: latLng.lat(),
                    lng: latLng.lng()
                }
            });

            setLocationStatus('✓ Location selected');
            setTimeout(() => setLocationStatus(''), 3000);
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            setLocationStatus('Could not resolve address');
        }
    };

    // Get current location using browser geolocation
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('Geolocation is not supported by your browser');
            return;
        }

        setFetchingLocation(true);
        setLocationStatus('Detecting your location...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocoding to get address from coordinates
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await response.json();
                    const address = data.display_name || 'Location detected';

                    setSupplier({
                        ...supplier,
                        address: address,
                        coordinates: {
                            lat: latitude,
                            lng: longitude
                        }
                    });

                    // If map is open, update marker
                    if (map) {
                        const position = new window.google.maps.LatLng(latitude, longitude);
                        placeMarker(position, map);
                        map.setCenter(position);
                        map.setZoom(15);
                    }

                    setLocationStatus('✓ Location detected');
                    setTimeout(() => setLocationStatus(''), 3000);
                } catch (error) {
                    setLocationStatus('Could not resolve address');
                }

                setFetchingLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setLocationStatus('Location access denied');
                setFetchingLocation(false);
            }
        );
    };

    // Load Google Maps API script
    const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
            const apiKey = "AIzaSyBThb9ieJOIHzM_616ZKBE31ibU8yIDuIs";

            if (!document.getElementById('google-maps-script')) {
                const script = document.createElement('script');
                script.id = 'google-maps-script';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                document.body.appendChild(script);
                script.async = true;
                script.defer = true;
            }
        });
    };

    // Toggle map visibility
    const toggleMap = async () => {
        if (!showMap) {
            try {
                // Load Google Maps API if not already loaded
                if (!window.google || !window.google.maps) {
                    await loadGoogleMapsScript();
                }
                setShowMap(true);
            } catch (error) {
                console.error("Error loading Google Maps:", error);
                notyf.error("Failed to load map. Please try again later.");
            }
        } else {
            setShowMap(false);
        }
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { companyName, email, phone, address, tinNumber, licenseNumber, password, coordinates } = supplier;

        // Validation
        if (!companyName || !email || !phone || !address || !tinNumber || !licenseNumber || !password) {
            return toast.error('Please fill all fields!');
        }

        const tinRegex = /^\d{10}$/;
        if (!tinRegex.test(tinNumber)) {
            return toast.error('Invalid TIN Number. It must be 10 digits.');
        }

        const licenseRegex = /^[A-Z]{2,3}\/\d{3,6}\/\d{4}$/;
        if (!licenseRegex.test(licenseNumber)) {
            return toast.error('Invalid License Number format.');
        }

        if (!agree) {
            return toast.error("You must agree to the terms and conditions.");
        }

        if (!coordinates.lat || !coordinates.lng) {
            return toast.error("Please select a location on the map.");
        }

        try {
            const result = await api.post('/supplier/sign-up', {
                companyName,
                email,
                phone,
                address,
                tinNumber,
                licenseNumber,
                password,
                lat: coordinates.lat,
                lng: coordinates.lng
            });

            if (result.data.status) {
                notyf.success('Your data will be processed');
                navigate('/supplier-page');
            } else {
                toast.error(result.data.message || 'Signup failed!');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
            toast.error(errorMessage);
            console.error(err);
        }
    };

    return (
        <div className="flex h-screen w-full bg-gray-50">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Left section - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    {/* Logo and brand */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative mb-1">
                            <img
                                className="relative w-48 h-24"
                                src={logo}
                                alt="ConstructEasy Logo"
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Join as a Supplier</h1>
                        <p className="text-sm text-gray-600">
                            Already have an account? <Link to="/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">Sign in</Link>
                        </p>
                    </div>

                    {/* Form - using grid to control vertical space */}
                    <div className="max-h-[calc(100vh-180px)] overflow-y-auto py-2">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
                            {/* Company Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={supplier.companyName}
                                    onChange={e => setSupplier({ ...supplier, companyName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter your company name"
                                />
                            </div>

                            {/* Two columns: Email and Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={supplier.email}
                                        onChange={e => setSupplier({ ...supplier, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={supplier.phone}
                                        onChange={e => setSupplier({ ...supplier, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="+251 902 920301"
                                    />
                                </div>
                            </div>

                            {/* Two columns: TIN and Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">TIN Number</label>
                                    <input
                                        type="text"
                                        value={supplier.tinNumber}
                                        onChange={e => setSupplier({ ...supplier, tinNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="1234567890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={supplier.password}
                                        onChange={e => setSupplier({ ...supplier, password: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {/* License Number */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Business License Number</label>
                                <input
                                    type="text"
                                    value={supplier.licenseNumber}
                                    onChange={e => setSupplier({ ...supplier, licenseNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="MT/1234/2015"
                                />
                            </div>

                            {/* Company Address with map integration */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Business Address</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={supplier.address}
                                        onChange={e => setSupplier({ ...supplier, address: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-20"
                                        placeholder="Your business address"
                                    />
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={toggleMap}
                                            className="text-blue-500 hover:text-blue-700 transition-all p-1"
                                            title="Pick location on map"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12 1.586l-4 4V17h8V5.586l-4-4zM6 17H4V9h2v8zm10 0h-2V9h2v8zm.707-14.707l-4-4a1 1 0 00-1.414 0l-4 4A1 1 0 006 3h12a1 1 0 00.707-1.707z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            className="text-blue-500 hover:text-blue-700 transition-all p-1"
                                            disabled={fetchingLocation}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${fetchingLocation ? 'animate-pulse' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {locationStatus && (
                                    <p className="text-xs text-blue-600 mt-1">{locationStatus}</p>
                                )}

                                {/* Map component */}
                                {showMap && (
                                    <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-300 shadow-md">
                                        <div
                                            ref={mapRef}
                                            className="w-full h-48"
                                        ></div>
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(false)}
                                            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-center">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agree}
                                        onChange={() => setAgree(!agree)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <div className="ml-2 text-xs">
                                    <label htmlFor="terms" className="text-gray-600">
                                        I agree to the <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Terms and Conditions</a>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow transition-all duration-300 transform hover:translate-y-[-2px]"
                            >
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right section - Banner Image */}
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
                <div className="w-full h-full flex items-end p-10  bg-gradient-to-br from-blue-600/80 to-indigo-900/60">
                    <div className="text-white max-w-lg">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Quality Materials, <br /><span className="text-blue-300">Solid Results</span></h2>
                        <p className="text-gray-200 text-base">Join our marketplace and connect with contractors looking for quality construction materials.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupplierSignUp;