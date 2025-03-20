import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaMap, FaFilter } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';
import SupplierMap from './SupplierMap';

function Nearby() {
    const [locationStatus, setLocationStatus] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [radiusFilter, setRadiusFilter] = useState(300); // Default radius in km
    
    // Fetch nearby suppliers when component mounts
    useEffect(() => {
        getNearbySuppliers();
    }, []);
    
    // Filter suppliers when radius changes
    useEffect(() => {
        if (userLocation && suppliers.length > 0) {
            filterSuppliersByRadius();
        }
    }, [radiusFilter, suppliers, userLocation]);
    
    const getNearbySuppliers = () => {
        setLocationStatus('Requesting location permission...');
        
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser.');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                fetchNearbySuppliers(latitude, longitude);
            },
            (error) => handleLocationError(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };
    
    const fetchNearbySuppliers = async (latitude, longitude) => {
        setLocationStatus('Finding nearby suppliers...');
        setIsLoading(true);
        
        try {
            // Fetch with a larger initial radius to have more data to filter locally
            const result = await api.get('/customer/nearby-suppliers', {
                params: { latitude, longitude, radius: 500 },
            });
            
            if (result.data.status && result.data.suppliers.length > 0) {
                // Calculate distance for each supplier
                const suppliersWithDistance = result.data.suppliers.map(supplier => {
                    const distance = calculateDistance(
                        latitude, 
                        longitude, 
                        supplier.latitude, 
                        supplier.longitude
                    );
                    
                    return {
                        ...supplier,
                        distance: distance // Distance in km
                    };
                });
                
                // Sort by distance
                suppliersWithDistance.sort((a, b) => a.distance - b.distance);
                
                setSuppliers(suppliersWithDistance);
                setFilteredSuppliers(suppliersWithDistance.filter(s => s.distance <= radiusFilter));
                
                toast.success(`Found ${suppliersWithDistance.length} suppliers nearby`);
            } else {
                setLocationStatus('No suppliers found nearby.');
                setSuppliers([]);
                setFilteredSuppliers([]);
            }
        } catch (err) {
            console.error(err);
            toast.error('Error fetching nearby suppliers.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const filterSuppliersByRadius = () => {
        const filtered = suppliers.filter(supplier => supplier.distance <= radiusFilter);
        setFilteredSuppliers(filtered);
    };
    
    // Haversine formula to calculate distance between two coordinates in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c; // Distance in km
        return distance;
    };
    
    const deg2rad = (deg) => {
        return deg * (Math.PI/180);
    };
    
    const handleLocationError = (error) => {
        let message = 'An unknown error occurred.';
        if (error.code === error.PERMISSION_DENIED) {
            message = 'Location permission denied. Please enable it in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
            message = 'Request to get location timed out.';
        }
        toast.error(message);
        setLocationStatus('');
        setIsLoading(false);
    };
    
    return (
        <div className="flex flex-col h-screen w-full">
            {/* Filter controls */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-md">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                        <FaFilter className="text-blue-500 mr-2" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Distance:</span>
                    </div>
                    <div className="flex-1">
                        <input
                            type="range"
                            min="1"
                            max="500"
                            value={radiusFilter}
                            onChange={(e) => setRadiusFilter(Number(e.target.value))}
                            className="w-full max-w-xs"
                        />
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-medium">
                        {radiusFilter} km
                    </div>
                    <div className="ml-4 text-gray-600 dark:text-gray-400">
                        {filteredSuppliers.length} suppliers found
                    </div>
                    <button
                        onClick={getNearbySuppliers}
                        className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                    >
                        <FaMapMarkerAlt className="mr-2" />
                        Refresh Location
                    </button>
                </div>
            </div>
            
            {/* Map container */}
            <div className="flex-1">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <SupplierMap
                        suppliers={filteredSuppliers}
                        selectedSupplier={selectedSupplier}
                        onSelectSupplier={setSelectedSupplier}
                        userLocation={userLocation}
                    />
                )}
            </div>
            
            {/* Selected supplier details (optional) */}
            {selectedSupplier && (
                <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">{selectedSupplier.companyName}</h3>
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                            {selectedSupplier.distance ? selectedSupplier.distance.toFixed(1) + ' km away' : ''}
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