import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaStore, FaLocationArrow } from 'react-icons/fa';
import toast from 'react-hot-toast';

function SupplierMap({ suppliers, selectedSupplier, onSelectSupplier, userLocation, radiusFilter }) {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [userMarker, setUserMarker] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState(null);
    const [radiusCircle, setRadiusCircle] = useState(null);

    // Load Google Maps API script
    const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const apiKey = "AIzaSyBThb9ieJOIHzM_616ZKBE31ibU8yIDuIs"; // Use your API key

            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Google Maps API'));

            document.body.appendChild(script);
        });
    };

    // Initialize map
    useEffect(() => {
        let isMounted = true;

        async function initializeMap() {
            try {
                setIsLoading(true);
                await loadGoogleMapsScript();

                if (!mapRef.current || !isMounted) return;

                // Default center (can be set to a default location in your country)
                const defaultCenter = { lat: 9.145, lng: 40.489 }; // Ethiopia center coordinates

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

                // Add custom control for current location
                const locationButton = document.createElement("button");
                locationButton.innerHTML = `<div style="background-color: #fff; border: 2px solid #fff; border-radius: 3px; box-shadow: 0 2px 6px rgba(0,0,0,.3); cursor: pointer; text-align: center; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-location-arrow" style="color: #1a73e8; font-size: 18px;"></i>
                </div>`;
                locationButton.classList.add("custom-map-control-button");
                locationButton.setAttribute("title", "Find my location");
                locationButton.type = "button";

                mapInstance.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

                locationButton.addEventListener("click", () => {
                    getUserLocation();
                });

                if (isMounted) {
                    setMap(mapInstance);
                    setIsLoading(false);

                    // Try to get user location automatically on map init
                    if (!userLocation) {
                        getUserLocation(true); // true = silent mode (no toast)
                    }
                }
            } catch (error) {
                console.error("Error initializing map:", error);
                if (isMounted) {
                    setMapError("Failed to load map. Please try again later.");
                    setIsLoading(false);
                }
            }
        }

        initializeMap();

        return () => {
            isMounted = false;
            // Clean up markers when component unmounts
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
    }, []);

    // Update user location marker when userLocation changes
    useEffect(() => {
        if (map && userLocation) {
            // Clear existing user marker
            if (userMarker) {
                userMarker.setMap(null);
            }

            const userPos = new window.google.maps.LatLng(
                userLocation.latitude,
                userLocation.longitude
            );

            // Create new user marker with custom icon
            const newUserMarker = new window.google.maps.Marker({
                position: userPos,
                map: map,
                title: 'Your Location',
                icon: {
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40)
                },
                zIndex: 1000 // Ensure user marker is on top
            });

            setUserMarker(newUserMarker);

            // Center map on user's location if no suppliers are selected
            if (!selectedSupplier) {
                map.setCenter(userPos);
                map.setZoom(12);
            }

            // Draw radius circle
            updateRadiusCircle(userPos);
        }
    }, [map, userLocation]);

    // Update radius circle when filter changes
    useEffect(() => {
        if (map && userLocation && radiusFilter) {
            const userPos = new window.google.maps.LatLng(
                userLocation.latitude,
                userLocation.longitude
            );
            updateRadiusCircle(userPos);
        }
    }, [radiusFilter, map, userLocation]);

    // Function to update the radius circle
    const updateRadiusCircle = (center) => {
        // Remove existing circle
        if (radiusCircle) {
            radiusCircle.setMap(null);
        }

        // Create new circle if we have a radius filter
        if (radiusFilter) {
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

            // Fit map to circle bounds
            map.fitBounds(newCircle.getBounds());
        }
    };

    // Add suppliers to map when suppliers array changes
    useEffect(() => {
        if (map && suppliers && suppliers.length > 0) {
            // Clear old markers
            if (markers.length > 0) {
                markers.forEach(marker => marker.setMap(null));
            }

            // Add new suppliers
            addSuppliersToMap(suppliers, map);
        }
    }, [map, suppliers]);

    // Update markers when selected supplier changes
    useEffect(() => {
        if (map && selectedSupplier && markers.length > 0) {
            const selectedMarker = markers.find(m => m.supplierId === selectedSupplier.id);

            if (selectedMarker) {
                // Center the map on the selected supplier
                map.setCenter(selectedMarker.getPosition());
                map.setZoom(15);

                // Make the selected supplier more visible
                selectedMarker.setAnimation(window.google.maps.Animation.BOUNCE);
                setTimeout(() => {
                    selectedMarker.setAnimation(null);
                }, 2000);

                // Change selected supplier marker color
                selectedMarker.setIcon({
                    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", // Green for selected
                    scaledSize: new window.google.maps.Size(40, 40)
                });

                // Open this supplier's info window
                selectedMarker.infoWindow.open(map, selectedMarker);

                // Update the rest of the markers back to default
                markers.forEach(m => {
                    if (m.supplierId !== selectedSupplier.id) {
                        m.setIcon({
                            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Red for nearby suppliers
                            scaledSize: new window.google.maps.Size(32, 32)
                        });
                        m.infoWindow.close();
                    }
                });
            }
        }
    }, [selectedSupplier, markers, map]);

    // Add suppliers to map
    const addSuppliersToMap = (suppliers, mapInstance) => {
        const newMarkers = [];
        const bounds = new window.google.maps.LatLngBounds();
        let validLocations = 0;

        suppliers.forEach(supplier => {
            if (supplier.latitude && supplier.longitude) {
                const position = new window.google.maps.LatLng(
                    parseFloat(supplier.latitude),
                    parseFloat(supplier.longitude)
                );

                // Create enhanced info window with distance if available
                const distanceInfo = supplier.distance
                    ? `<p style="color: #3182ce; font-weight: bold; margin-bottom: 5px;">${supplier.distance.toFixed(1)} km away</p>`
                    : '';

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div style="max-width: 250px; padding: 8px;">
                            <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${supplier.companyName}</h3>
                            ${distanceInfo}
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

                // Create custom marker (you can use different icons for different types of suppliers)
                const marker = new window.google.maps.Marker({
                    position,
                    map: mapInstance,
                    title: supplier.companyName,
                    icon: {
                        url: selectedSupplier && selectedSupplier.id === supplier.id
                            ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"  // Green for selected
                            : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",   // Red for regular
                        scaledSize: new window.google.maps.Size(32, 32)
                    },
                    supplierId: supplier.id,
                    animation: selectedSupplier && selectedSupplier.id === supplier.id
                        ? window.google.maps.Animation.BOUNCE
                        : null
                });

                // Add click listener to marker
                marker.addListener('click', () => {
                    // Close any open info windows
                    newMarkers.forEach(m => m.infoWindow.close());

                    // Open this info window
                    infoWindow.open(mapInstance, marker);

                    // Select this supplier
                    if (onSelectSupplier) {
                        onSelectSupplier(supplier);
                    }
                });

                // Store info window with marker for reference
                marker.infoWindow = infoWindow;

                newMarkers.push(marker);
                bounds.extend(position);
                validLocations++;
            }
        });

        setMarkers(newMarkers);

        // Include user position in bounds if available
        if (userLocation) {
            const userPos = new window.google.maps.LatLng(
                userLocation.latitude,
                userLocation.longitude
            );
            bounds.extend(userPos);
        }

        // Fit map to bounds if we have valid locations
        if (validLocations > 0) {
            mapInstance.fitBounds(bounds);

            // If only one location, zoom out a bit
            if (validLocations === 1) {
                mapInstance.setZoom(14);
            }
        } else if (userLocation) {
            // If no suppliers but we have user location, center on user
            const userPos = new window.google.maps.LatLng(
                userLocation.latitude,
                userLocation.longitude
            );
            mapInstance.setCenter(userPos);
            mapInstance.setZoom(13);
        }
    };

    // Listen for custom event from infoWindow button
    useEffect(() => {
        const handleSelectSupplier = (event) => {
            const supplierId = event.detail;
            const supplier = suppliers.find(s => s.id === supplierId);
            if (supplier && onSelectSupplier) {
                onSelectSupplier(supplier);
            }
        };

        document.addEventListener('selectSupplier', handleSelectSupplier);

        return () => {
            document.removeEventListener('selectSupplier', handleSelectSupplier);
        };
    }, [suppliers, onSelectSupplier]);

    // Get user's current location
    const getUserLocation = (silent = false) => {
        if (!navigator.geolocation) {
            if (!silent) toast.error('Geolocation is not supported by your browser');
            return;
        }

        const locationPromise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userPos = new window.google.maps.LatLng(latitude, longitude);

                    // Clear existing user marker
                    if (userMarker) {
                        userMarker.setMap(null);
                    }

                    // Create new user marker
                    const newUserMarker = new window.google.maps.Marker({
                        position: userPos,
                        map: map,
                        title: 'Your Location',
                        icon: {
                            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            scaledSize: new window.google.maps.Size(40, 40)
                        },
                        zIndex: 1000 // Ensure user marker is on top
                    });

                    setUserMarker(newUserMarker);

                    // Center map on user's location
                    map.setCenter(userPos);
                    map.setZoom(13);

                    // Draw radius circle around user location
                    updateRadiusCircle(userPos);

                    resolve(position);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    reject(new Error('Could not get your location'));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });

        if (!silent) {
            toast.promise(locationPromise, {
                loading: 'Getting your location...',
                success: 'Location found!',
                error: 'Could not get your location'
            });
        }

        return locationPromise;
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full">
            <div className="relative h-full flex flex-col">
                {/* Map Header */}
                <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Supplier Locations</h3>
                    <button
                        onClick={() => getUserLocation()}
                        className="bg-white text-blue-500 hover:bg-blue-50 px-3 py-1 rounded-lg flex items-center text-sm font-medium"
                        disabled={!map}
                    >
                        <FaLocationArrow className="mr-1" />
                        My Location
                    </button>
                </div>

                {/* Map Container */}
                <div
                    ref={mapRef}
                    className="w-full flex-1"
                    style={{ position: 'relative', minHeight: '350px' }}
                ></div>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                            <p className="text-gray-700 dark:text-gray-300 font-medium">Loading map...</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {mapError && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 flex items-center justify-center">
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

                {/* Map Legend */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-4">
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
                        <span className="text-sm text-gray-700 dark:text-gray-300">You</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-pink-500 rounded-full bg-pink-100 bg-opacity-30 mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Filter radius</span>
                    </div>
                    <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                        {markers.length} suppliers shown
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupplierMap;