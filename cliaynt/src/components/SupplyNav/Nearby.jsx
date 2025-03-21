import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaFilter, FaLocationArrow, FaStore } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

function Nearby() {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [radiusFilter, setRadiusFilter] = useState(50); // Default radius in km
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [userMarker, setUserMarker] = useState(null);
    const [radiusCircle, setRadiusCircle] = useState(null);
    const [mapError, setMapError] = useState(null);
    const mapRef = React.useRef(null);

    // Load Google Maps when component mounts
    useEffect(() => {
        loadGoogleMapsScript()
            .then(() => {
                initializeMap();
                getUserLocation();
            })
            .catch(error => {
                console.error("Failed to load map:", error);
                setMapError("Failed to load Google Maps. Please refresh the page.");
                setIsLoading(false);
            });

        return () => {
            // Clean up markers and circles when component unmounts
            cleanupMapObjects();
        };
    }, []);

    // Filter suppliers when radius or user location changes
    useEffect(() => {
        if (userLocation && suppliers.length > 0) {
            filterSuppliersByRadius();
        }
    }, [radiusFilter, suppliers, userLocation]);

    // Update map elements when filtered suppliers change
    useEffect(() => {
        if (map && filteredSuppliers.length > 0) {
            updateMapMarkers();
        }
    }, [map, filteredSuppliers]);

    // Update radius circle when filter or user location changes
    useEffect(() => {
        if (map && userLocation) {
            updateRadiusCircle();
        }
    }, [map, userLocation, radiusFilter]);

    // Load Google Maps API
    const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const apiKey = "AIzaSyBThb9ieJOIHzM_616ZKBE31ibU8yIDuIs"; // Replace with your API key
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Google Maps API'));
            document.body.appendChild(script);
        });
    };

    // Initialize map
    const initializeMap = () => {
        if (!mapRef.current) return;

        // Create map with default center (you can modify these coordinates)
        const defaultCenter = { lat: 9.145, lng: 40.4897 };

        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 2, // World view initially
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_CENTER
            }
        });

        // Create custom location button
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

        mapInstance.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
        locationButton.addEventListener("click", getUserLocation);

        setMap(mapInstance);
        setIsLoading(false);
    };

    // Get user's current location and fetch nearby suppliers
    const getUserLocation = () => {
        setIsLoading(true);

        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser.');
            setIsLoading(false);
            return;
        }

        const locationPromise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });

                    if (map) {
                        // Update map center and zoom
                        const userPos = new window.google.maps.LatLng(latitude, longitude);
                        map.setCenter(userPos);
                        map.setZoom(12);

                        // Update user marker
                        if (userMarker) userMarker.setMap(null);

                        const newUserMarker = new window.google.maps.Marker({
                            position: userPos,
                            map: map,
                            title: 'Your Location',
                            icon: {
                                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                scaledSize: new window.google.maps.Size(40, 40)
                            },
                            zIndex: 1000
                        });

                        setUserMarker(newUserMarker);
                    }

                    fetchNearbySuppliers(latitude, longitude);
                    resolve(position);
                },
                error => {
                    console.error('Geolocation error:', error);
                    let message = 'An unknown error occurred.';
                    if (error.code === error.PERMISSION_DENIED) {
                        message = 'Location permission denied. Please enable it in your browser.';
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        message = 'Location information is unavailable.';
                    } else if (error.code === error.TIMEOUT) {
                        message = 'Request to get location timed out.';
                    }
                    toast.error(message);
                    setIsLoading(false);
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });

        toast.promise(locationPromise, {
            loading: 'Getting your location...',
            success: 'Location found!',
            error: 'Could not get your location'
        });
    };

    // Fetch nearby suppliers from API
    const fetchNearbySuppliers = async (latitude, longitude) => {
        setIsLoading(true);

        try {
            // Fetch with a larger initial radius to filter locally
            const result = await api.get('/customer/nearby-suppliers', {
                params: { latitude, longitude, radius: 500 }
            });

            if (result.data.status && result.data.suppliers.length > 0) {
                // Calculate distance for each supplier
                const suppliersWithDistance = result.data.suppliers.map(supplier => {
                    const distance = calculateDistance(
                        latitude,
                        longitude,
                        supplier.lat, // Changed from supplier.latitude
                        supplier.lng  // Changed from supplier.longitude
                    );

                    return {
                        ...supplier,
                        distance: distance // Distance in km
                    };
                });

                // Sort by distance
                suppliersWithDistance.sort((a, b) => a.distance - b.distance);

                setSuppliers(suppliersWithDistance);

                // Filter by current radius setting
                const filtered = suppliersWithDistance.filter(supplier =>
                    supplier.distance <= radiusFilter
                );
                setFilteredSuppliers(filtered);

                toast.success(`Found ${filtered.length} suppliers within ${radiusFilter}km`);
            } else {
                setSuppliers([]);
                setFilteredSuppliers([]);
                toast.error('No suppliers found nearby.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error fetching nearby suppliers.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter suppliers by radius
    const filterSuppliersByRadius = () => {
        const filtered = suppliers.filter(supplier => supplier.distance <= radiusFilter);
        setFilteredSuppliers(filtered);

        // Update map bounds to show all filtered suppliers
        if (map && filtered.length > 0 && userLocation) {
            const bounds = new window.google.maps.LatLngBounds();

            // Add user location to bounds
            const userPos = new window.google.maps.LatLng(
                userLocation.latitude,
                userLocation.longitude
            );
            bounds.extend(userPos);

            // Add all filtered suppliers to bounds
            filtered.forEach(supplier => {
                if (supplier.lat && supplier.lng) { // Changed from latitude/longitude
                    const position = new window.google.maps.LatLng(
                        parseFloat(supplier.lat),  // Changed from supplier.latitude
                        parseFloat(supplier.lng)   // Changed from supplier.longitude
                    );
                    bounds.extend(position);
                }
            });

            // Apply bounds with padding
            map.fitBounds(bounds, 50); // 50px padding
        }
    };

    // Update map markers for filtered suppliers
    const updateMapMarkers = () => {
        // Clear existing markers
        if (markers.length > 0) {
            markers.forEach(marker => marker.setMap(null));
        }

        const newMarkers = [];

        // Create marker for each filtered supplier
        filteredSuppliers.forEach(supplier => {
            if (supplier.lat && supplier.lng) { // Changed from latitude/longitude
                const position = new window.google.maps.LatLng(
                    parseFloat(supplier.lat),  // Changed from supplier.latitude
                    parseFloat(supplier.lng)   // Changed from supplier.longitude
                );

                // Create info window with supplier details
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div style="max-width: 250px; padding: 8px;">
                            <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${supplier.companyName}</h3>
                            <p style="color: #3182ce; font-weight: bold; margin-bottom: 5px;">${supplier.distance.toFixed(1)} km away</p>
                            <p style="margin-bottom: 5px;"><strong>Address:</strong> ${supplier.address || 'No address provided'}</p>
                            <p style="margin-bottom: 5px;"><strong>Phone:</strong> ${supplier.phone || 'No phone provided'}</p>
                            <button 
                                style="background-color: #3182ce; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin-top: 8px; cursor: pointer; width: 100%;"
                                onclick="document.dispatchEvent(new CustomEvent('selectSupplier', {detail: ${supplier.id}}))"
                            >
                                Select This Supplier
                            </button>
                        </div>
                    `
                });

                // Create marker with appropriate icon
                const marker = new window.google.maps.Marker({
                    position,
                    map: map,
                    title: supplier.companyName,
                    icon: {
                        url: selectedSupplier && selectedSupplier.id === supplier.id
                            ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        scaledSize: new window.google.maps.Size(32, 32)
                    },
                    supplierId: supplier.id,
                    animation: selectedSupplier && selectedSupplier.id === supplier.id
                        ? window.google.maps.Animation.BOUNCE
                        : null
                });

                // Add click listener
                marker.addListener('click', () => {
                    // Close any open info windows
                    newMarkers.forEach(m => m.infoWindow.close());

                    // Open this info window
                    infoWindow.open(map, marker);

                    // Select this supplier
                    setSelectedSupplier(supplier);
                });

                // Store info window with marker
                marker.infoWindow = infoWindow;
                newMarkers.push(marker);
            }
        });

        setMarkers(newMarkers);

        // If a supplier is selected, make sure its marker is highlighted
        if (selectedSupplier) {
            const selectedMarker = newMarkers.find(m => m.supplierId === selectedSupplier.id);
            if (selectedMarker) {
                newMarkers.forEach(m => m.infoWindow.close());
                selectedMarker.infoWindow.open(map, selectedMarker);
                selectedMarker.setIcon({
                    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40)
                });
            }
        }
    };

    // Update radius circle on map
    const updateRadiusCircle = () => {
        // Clear existing circle
        if (radiusCircle) {
            radiusCircle.setMap(null);
        }

        if (!userLocation || !map) return;

        // Create center position
        const center = new window.google.maps.LatLng(
            userLocation.latitude,
            userLocation.longitude
        );

        // Create new circle
        const newCircle = new window.google.maps.Circle({
            strokeColor: "#FF6384",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF6384",
            fillOpacity: 0.1,
            map: map,
            center: center,
            radius: radiusFilter * 1000, // Convert km to meters
            zIndex: 1
        });

        setRadiusCircle(newCircle);
    };

    // Clean up map objects (markers, circles)
    const cleanupMapObjects = () => {
        if (markers.length > 0) {
            markers.forEach(marker => marker.setMap(null));
        }

        if (userMarker) {
            userMarker.setMap(null);
        }

        if (radiusCircle) {
            radiusCircle.setMap(null);
        }
    };

    // Calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    // Listen for supplier selection from infowindow
    useEffect(() => {
        const handleSelectSupplier = (event) => {
            const supplierId = event.detail;
            const supplier = suppliers.find(s => s.id === supplierId);
            if (supplier) {
                setSelectedSupplier(supplier);
            }
        };

        document.addEventListener('selectSupplier', handleSelectSupplier);
        return () => {
            document.removeEventListener('selectSupplier', handleSelectSupplier);
        };
    }, [suppliers]);

    return (
        <div className="flex flex-col h-screen w-full">
            {/* Filter controls */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-md">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                        <FaFilter className="text-blue-500 mr-2" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Search Radius:</span>
                    </div>
                    <div className="flex-1">
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={radiusFilter}
                            onChange={(e) => setRadiusFilter(Number(e.target.value))}
                            className="w-full max-w-xs"
                            disabled={!userLocation}
                        />
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            {filteredSuppliers.length} suppliers within {radiusFilter}km
                        </span>
                    </div>
                    <button
                        onClick={getUserLocation}
                        className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                    >
                        <FaMapMarkerAlt className="mr-2" />
                        Refresh Location
                    </button>
                </div>
            </div>

            {/* Map container */}
            <div className="flex-1 relative">
                <div
                    ref={mapRef}
                    className="w-full h-full"
                >
                    {/* Map will be rendered here */}
                </div>

                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-10">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                            <p className="text-gray-700 dark:text-gray-300 font-medium">
                                {userLocation ? 'Finding nearby suppliers...' : 'Getting your location...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Error message */}
                {mapError && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 flex items-center justify-center z-10">
                        <div className="text-center p-4">
                            <p className="text-red-500 font-medium mb-2">{mapError}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Map legend */}
            <div className="bg-white dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Supplier</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Selected</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Your Location</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-pink-500 rounded-full bg-pink-100 bg-opacity-30 mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Search Radius</span>
                    </div>
                </div>
            </div>

            {/* Selected supplier details */}
            {selectedSupplier && (
                <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">{selectedSupplier.companyName}</h3>
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                            {selectedSupplier.distance.toFixed(1)} km away
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedSupplier.address}</p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedSupplier.phone}</p>
                </div>
            )}
        </div>
    );
}

export default Nearby;