import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import FoundationIcon from '@mui/icons-material/Foundation';
import ConstructionIcon from '@mui/icons-material/Construction';
import HardwareIcon from '@mui/icons-material/Hardware';
import LandscapeIcon from '@mui/icons-material/Landscape';
import ForestIcon from '@mui/icons-material/Forest';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import CategoryIcon from '@mui/icons-material/Category';
import RoofingIcon from '@mui/icons-material/Roofing';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import GridOnIcon from '@mui/icons-material/GridOn';
import ScienceIcon from '@mui/icons-material/Science';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedIcon from '@mui/icons-material/Verified';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FactoryIcon from '@mui/icons-material/Factory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HandshakeIcon from '@mui/icons-material/Handshake';
import NearMeIcon from '@mui/icons-material/NearMe';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import api from '../../api';
import toast from 'react-hot-toast';

function Body() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [activeFilter, setActiveFilter] = useState('suppliers'); // Default to suppliers first
    const [isLoading, setIsLoading] = useState(true);


    // Fetch categories



    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await api.get('/customer/get-category');
                if (result.data.status) {
                    setCategories(result.data.category);
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.log(err);
                toast.error(err.response?.data?.message || 'Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    // Fetch suppliers
    useEffect(() => {
        const fetchSuppliers = async () => {
            setIsLoading(true);
            try {
                const result = await api.get('/customer/get-supplier');
                if (result.data.status) {
                    setSuppliers(result.data.supplier);
                    setFilteredSuppliers(result.data.supplier);
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.log(err);
                toast.error(err.response?.data?.message || 'Error fetching suppliers');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    // Filter suppliers based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = suppliers.filter(
                (supplier) =>
                    supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSuppliers(filtered);
        } else {
            setFilteredSuppliers(suppliers);
        }
    }, [searchTerm, suppliers]);

    const handleSupplierSelect = (supplier) => {
        setSelectedSupplier(supplier);
        setActiveFilter('categories');

        document.getElementById('categoriesList')?.scrollIntoView({ behavior: 'smooth' });
    };


    // Add this function to your Body component



    // Get icon for category
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            'Foundation': <FoundationIcon />,
            'Construction': <ConstructionIcon />,
            'Hardware': <HardwareIcon />,
            'Landscape': <LandscapeIcon />,
            'Forestry': <ForestIcon />,
            'Painting': <FormatPaintIcon />,
            'Plumbing': <PlumbingIcon />,
            'Electrical': <ElectricalServicesIcon />,
            'Roofing': <RoofingIcon />,
            'Doors': <DoorSlidingIcon />,
            'Flooring': <GridOnIcon />,
            'Chemical': <ScienceIcon />,
            'Manufacturing': <FactoryIcon />,
            'Shipping': <LocalShippingIcon />,
            'Services': <HandshakeIcon />,
        };

        return iconMap[categoryName] || <CategoryIcon />;
    };

    return (
        <div className='mt-6'>
            {/* Search and Nearby Button */}
            <div className='flex justify-center p-3 relative'>
                <div className="relative max-w-md w-full">
                    <input
                        type="text"
                        placeholder="Search suppliers or products..."
                        className="w-full justify-center outline-none border border-gray-200 dark:border-gray-800 p-2 pl-10 rounded-xl dark:bg-gray-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <Link to={'/products/nearby'}
                    onClick={() => setShowNearbyModal(true)}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl flex items-center"
                >
                    <NearMeIcon className="mr-1" />
                    <span className="hidden md:inline">Nearby</span>
                </Link>
            </div>

            {/* Selected Supplier Display */}
            {selectedSupplier && (
                <div className="mx-4 mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center">
                        <StorefrontIcon className="mr-2 text-blue-500" />
                        <div>
                            <div className="font-medium flex items-center">
                                {selectedSupplier.companyName}
                                {selectedSupplier.isApproved && (
                                    <VerifiedIcon className="ml-1 text-blue-500" style={{ fontSize: '1rem' }} />
                                )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedSupplier.address}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedSupplier(null)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <span className="text-sm">Change</span>
                    </button>
                </div>
            )}

            <div className="grid md:flex">
                {/* Sidebar */}
                <div className="border dark:border-gray-900 md:w-1/4 h-auto md:h-screen overflow-y-auto max-h-[80vh] m-4 rounded-lg p-1 custom-scrollbar">
                    <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-2 border-b dark:border-gray-800">
                        <div className="flex justify-around text-center">
                            <button
                                className={`py-2 px-4 rounded-lg transition duration-300 flex-1 ${activeFilter === 'suppliers' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                                onClick={() => setActiveFilter('suppliers')}
                            >
                                <span className="flex items-center justify-center">
                                    <BusinessIcon className="mr-2" />
                                    Suppliers
                                </span>
                            </button>
                            <button
                                className={`py-2 px-4 rounded-lg transition duration-300 flex-1 ${activeFilter === 'categories' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                                onClick={() => setActiveFilter('categories')}
                                disabled={!selectedSupplier}
                            >
                                <span className="flex items-center justify-center">
                                    <CategoryIcon className="mr-2" />
                                    Categories
                                </span>
                            </button>
                        </div>
                    </div>

                    {activeFilter === 'suppliers' && (
                        <div className='p-2'>
                            <p className='font-semibold text-xl pt-2 flex justify-between items-center'>
                                Suppliers
                                <span className="text-sm text-gray-500">
                                    {filteredSuppliers.length} found
                                </span>
                            </p>
                            <div className="p-1 hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300">
                                <Link className='p-1 w-full block'>All Suppliers</Link>
                            </div>
                            <div className="flex text-left p-1">
                                <ul className="overflow-y-auto w-full">
                                    {isLoading ? (
                                        <div className="flex justify-center p-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : filteredSuppliers.length === 0 ? (
                                        <div className="text-center p-4 text-gray-500">
                                            No suppliers found
                                        </div>
                                    ) : (
                                        filteredSuppliers.map((supplier) => (
                                            <li
                                                key={supplier.id}
                                                className={`p-1 flex items-center hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300 ${selectedSupplier?.id === supplier.id ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                                                onClick={() => handleSupplierSelect(supplier)}
                                            >
                                                <span className='w-9'><StorefrontIcon /></span>
                                                <div className='p-1 w-full'>
                                                    <div className="flex items-center">
                                                        {supplier.companyName}
                                                        {supplier.isApproved && (
                                                            <VerifiedIcon className="ml-2 text-blue-500" style={{ fontSize: '1rem' }} />
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        {supplier.address}
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeFilter === 'categories' && (
                        <div className='p-2' id="categoriesList">
                            <p className='font-semibold text-xl pt-2'>Categories</p>
                            <div className="p-1 hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300">
                                <Link className='p-1 w-full block'>All Categories</Link>
                            </div>
                            <div className="flex text-left p-1">
                                <ul className="overflow-y-auto w-full">
                                    {categories.map((category) => (
                                        <li
                                            key={category.id}
                                            className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'
                                        >
                                            <span className='w-9'>{getCategoryIcon(category.category)}</span>
                                            <Link
                                                to={`/products/supplier-products/${selectedSupplier?.id}?category=${category.id}`}
                                                className='p-1 w-full'
                                            >
                                                {category.category}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 custom-scrollbar">
                    {!selectedSupplier && activeFilter === 'categories' ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <BusinessIcon className="text-gray-400 mb-4" style={{ fontSize: '4rem' }} />
                            <h3 className="text-xl font-semibold text-gray-500 mb-2">Please select a supplier first</h3>
                            <p className="text-gray-400">Choose a supplier from the sidebar to view categories</p>
                            <button
                                onClick={() => setActiveFilter('suppliers')}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Select Supplier
                            </button>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Body;