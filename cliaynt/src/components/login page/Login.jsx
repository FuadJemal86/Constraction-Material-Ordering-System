import React, { useState, useEffect, useRef } from 'react';
import logo from '../../images/logo constraction.jpeg';
import banner from '../../images/login banner.jpg';
import api from '../../api';
import { Toaster, toast } from 'react-hot-toast';
import { Notyf } from 'notyf';
import { Link, useNavigate } from 'react-router-dom';
import 'notyf/notyf.min.css';


function Login() {
    const notyf = new Notyf();
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [showMap, setShowMap] = useState(false);

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

    // Initialize the map when showMap becomes true
    useEffect(() => {
        if (showMap && mapRef.current && !map) {
            // Default center (can be set to a default location in your country)
            const defaultCenter = { lat: 9.145, lng: 40.489 }; // Ethiopia center coordinates

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
        if (marker) {
            marker.setMap(null);
        }

        const newMarker = new window.google.maps.Marker({
            position: location,
            map: mapInstance,
            animation: window.google.maps.Animation.DROP
        });

        setMarker(newMarker);

        setSupplier({
            ...supplier,
            coordinates: {
                lat: location.lat(),
                lng: location.lng()
            }
        });
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

    // Toggle map visibility


    // Load Google Maps API script
    const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
            // Hard-code the API key temporarily for testing
            const apiKey = "AIzaSyBThb9ieJOIHzM_616ZKBE31ibU8yIDuIs"; 
            // Or use environment variable (preferred for production)
            // const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            
            console.log("API Key being used:", apiKey); // Debug log
            
            if (!document.getElementById('google-maps-script')) {
                const script = document.createElement('script');
                script.id = 'google-maps-script';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                document.body.appendChild(script);
                script.async = true;
                script.defer = true;
                
                // Rest of function remains the same
            }
        });
    };
    // Fix the toggleMap function - remove the call to initializeMap
    const toggleMap = async () => {
        if (!showMap) {
            try {
                // Load Google Maps API if not already loaded
                if (!window.google || !window.google.maps) {
                    await loadGoogleMapsScript();
                }
                
                // Set showMap to true first, to render the map container
                setShowMap(true);
                
                // Remove initializeMap call - let the useEffect handle it
                // The useEffect will run after the component re-renders with showMap=true
            } catch (error) {
                console.error("Error loading Google Maps:", error);
                notyf.error("Failed to load map. Please try again later.");
            }
        } else {
            setShowMap(false);
        }
    };

    // Initialize the map when showMap becomes true
    // Fix the initializeMap function
    const initializeMap = async () => {
        // Wait for the Google Maps script to load
        if (!window.google || !window.google.maps) {
            console.error("Google Maps API is not loaded.");
            return;
        }

        // Make sure mapRef.current exists
        if (!mapRef.current) {
            console.error("Map container element is not found.");
            return;
        }

        // Once the script is loaded, create the map
        try {
            const mapOptions = {
                center: new window.google.maps.LatLng(9.145, 40.489), // Default to Ethiopia
                zoom: 10,
                mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            };
            // Use mapRef.current instead of document.getElementById('map')
            const mapInstance = new window.google.maps.Map(mapRef.current, mapOptions);
            console.log("Map initialized:", mapInstance);
            setMap(mapInstance);
        } catch (error) {
            console.error("Error initializing the map:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { companyName, email, phone, address, tinNumber, licenseNumber, password } = supplier;

        if (!companyName || !email || !phone || !address || !tinNumber || !licenseNumber || !password) {
            return toast.error('Please fill all fields!');
        }

        const tinRegex = /^\d{10}$/;
        if (!tinRegex.test(tinNumber)) {
            return toast.error('Invalid TIN Number. It must be 10 digits.')
        }

        const licenseRegex = /^[A-Z]{2,3}\/\d{3,6}\/\d{4}$/;
        if (!licenseRegex.test(licenseNumber)) {
            return toast.error('Invalid License Number format.')
        }

        if (!agree) {
            return toast.error("You must agree to the terms and conditions.");
        }

        try {
            const result = await api.post('/supplier/sign-up', supplier);

            if (result.data.status) {
                notyf.success('Your data will be processed');

                navigate('/supplier-page')

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
        <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen gap-8 lg:gap-32 p-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="grid gap-5 text-center lg:ml-52">
                <div className="grid items-center">
                    <div className="relative mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-70"></div>
                        <img className="relative w-24 h-24 mx-auto bg-white rounded-full border-2 border-white shadow-lg" src={logo} alt="Logo" />
                    </div>
                    <span className="text-xl font-bold font-poppins mt-2 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">ConstructEasy</span>
                </div>

                <div className="grid gap-1">
                    <span className="text-3xl font-bold font-poppins text-gray-800">Create your account.</span>
                    <span className="text-sm font-light font-poppins text-gray-600">
                        Already have an account? <span className="text-blue-500 cursor-pointer font-semibold hover:text-blue-700 transition-colors"><Link to={'/sign-in'}>Sign in</Link></span>
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="max-w-[336px] grid gap-3">
                        <div className="grid text-left">
                            <label className="text-xs mb-1 font-light font-poppins text-gray-500">Full name / Company name</label>
                            <input
                                value={supplier.companyName}
                                onChange={e => setSupplier({ ...supplier, companyName: e.target.value })}
                                className="w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md"
                                placeholder="Your name"
                            />
                        </div>

                        <div className="flex gap-3">
                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">Email address</label>
                                <input
                                    value={supplier.email}
                                    onChange={e => setSupplier({ ...supplier, email: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md"
                                    placeholder="example@gmail.com"
                                />
                            </div>

                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">Phone number</label>
                                <input
                                    value={supplier.phone}
                                    onChange={e => setSupplier({ ...supplier, phone: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md"
                                    placeholder="+251 902 920301"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">TIN number</label>
                                <input
                                    value={supplier.tinNumber}
                                    onChange={e => setSupplier({ ...supplier, tinNumber: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md"
                                    placeholder='**** **** **'
                                />
                            </div>

                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">Password</label>
                                <input
                                    type="password"
                                    value={supplier.password}
                                    onChange={e => setSupplier({ ...supplier, password: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md"
                                    placeholder="*****"
                                />
                            </div>
                        </div>

                        <div className="grid text-left">
                            <label className="text-xs mb-1 font-light font-poppins text-gray-500">Company Address</label>
                            <div className="relative">
                                <input
                                    value={supplier.address}
                                    onChange={e => setSupplier({ ...supplier, address: e.target.value })}
                                    placeholder="-------"
                                    className="w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md pr-16"
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                                    <button
                                        type="button"
                                        onClick={toggleMap}
                                        className="text-blue-500 hover:text-blue-700 transition-colors mr-2"
                                        title="Pick location on map"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 1.586l-4 4V17h8V5.586l-4-4zM6 17H4V9h2v8zm10 0h-2V9h2v8zm.707-14.707l-4-4a1 1 0 00-1.414 0l-4 4A1 1 0 006 3h12a1 1 0 00.707-1.707z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                        disabled={fetchingLocation}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${fetchingLocation ? 'animate-pulse' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {locationStatus && (
                                <span className="text-xs font-light text-blue-500 mt-1 transition-opacity duration-300">{locationStatus}</span>
                            )}

                            {/* Map component - only shown when showMap is true */}
                            {showMap && (
                                <div className="mt-2 relative">
                                    <div
                                        ref={mapRef}
                                        className="w-full h-48 rounded-lg border border-gray-300 shadow-sm"
                                    ></div>
                                    <button
                                        type="button"
                                        onClick={() => setShowMap(false)}
                                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid text-left">
                            <label className="text-xs mb-1 font-light font-poppins text-gray-500">Business license number</label>
                            <input
                                value={supplier.licenseNumber}
                                onChange={e => setSupplier({ ...supplier, licenseNumber: e.target.value })}
                                placeholder="MT/1234/2015"
                                className="w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md"
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="agree-terms"
                                    checked={agree}
                                    onChange={() => setAgree(!agree)}
                                    className="w-3 h-3 cursor-pointer opacity-0 absolute"
                                />
                                <div className={`w-3 h-3 border rounded transition-all ${agree ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                    {agree && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <label htmlFor="agree-terms" className="text-xs font-thin font-poppins text-gray-500 cursor-pointer">
                                I agree to the <span className="text-blue-500 cursor-pointer font-semibold hover:text-blue-700 transition-colors">terms and conditions</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-[336px] h-8 text-white rounded-xl font-poppins font-medium relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:scale-110"></div>
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <span className="relative z-10">Sign Up</span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="hidden lg:flex justify-end">
                <div
                    style={{ backgroundImage: `url(${banner})` }}
                    className="bg-cover bg-center w-[500px] h-[650px] rounded-3xl relative shadow-xl transform transition-transform hover:scale-[1.01] hover:shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-3xl"></div>
                    <div className="absolute bottom-4 text-5xl text-white px-6 py-3 rounded-lg font-bold shadow-lg font-poppins">
                        Quality Materials, <br /> <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Solid Result</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;