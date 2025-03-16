import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
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
import api from '../../api';
import toast from 'react-hot-toast';

function Body() {
    // Example data that would come from backend

    const [category, setCategory] = useState([])
    const [supplier , setSupplier] = useState([])

    useEffect(() => {

        const feachData = async () => {

            try {
                const result = await api.get('/customer/get-category')

                if (result.data.status) {
                    setCategory(result.data.category)
                } else {
                    toast.error(result.data.message)
                }
            } catch (err) {
                console.log(err)
                toast.error(err.response.data.message)
            }
        }

        feachData()

    },[])

    useEffect(() => {

        const feachData = async () => {

            try {
                const result = await api.get('/customer/get-supplier')

                if (result.data.status) {
                    setSupplier(result.data.supplier)
                } else {
                    toast.error(result.data.message)
                }
            } catch (err) {
                console.log(err)
                toast.error(err.response.data.message)
            }
        }

        feachData()

    },[])
        const CategoryIco = [
        { id: 1, name: 'Cement & Concrete', icon: <FoundationIcon /> },
        { id: 2, name: 'Bricks & Blocks', icon: <ConstructionIcon /> },
        { id: 3, name: 'Steel & Metal', icon: <HardwareIcon /> },
        { id: 4, name: 'Sand & Aggregates', icon: <LandscapeIcon /> },
        { id: 5, name: 'Wood & Timber', icon: <ForestIcon /> },
        { id: 6, name: 'Paints & Finishes', icon: <FormatPaintIcon /> },
        { id: 7, name: 'Plumbing & Sanitary', icon: <PlumbingIcon /> },
        { id: 8, name: 'Electrical Materials', icon: <ElectricalServicesIcon /> },
        { id: 9, name: 'Miscellaneous', icon: <CategoryIcon /> },
        { id: 10, name: 'Roofing & Insulation', icon: <RoofingIcon /> },
        { id: 11, name: 'Doors & Windows', icon: <DoorSlidingIcon /> },
        { id: 12, name: 'Flooring & Tiles', icon: <GridOnIcon /> },
        { id: 13, name: 'Construction Chemicals', icon: <ScienceIcon /> },
    ];

    const supplierData = [
        { id: 1, name: 'BuildMaster Pro', rating: 4.8, verified: true, icon: <BusinessIcon /> },
        { id: 2, name: 'ConstructHub', rating: 4.5, verified: true, icon: <StorefrontIcon /> },
        { id: 3, name: 'PremiumStructures', rating: 4.9, verified: true, icon: <FactoryIcon /> },
        { id: 4, name: 'Urban Materials', rating: 4.3, verified: false, icon: <LocalShippingIcon /> },
        { id: 5, name: 'MegaBuild Supply', rating: 4.7, verified: true, icon: <BusinessIcon /> },
        { id: 6, name: 'Concrete Kings', rating: 4.6, verified: true, icon: <FoundationIcon /> },
        { id: 7, name: 'Steel Solutions', rating: 4.4, verified: false, icon: <HardwareIcon /> },
        { id: 8, name: 'TopGrade Materials', rating: 4.2, verified: true, icon: <HandshakeIcon /> },
        { id: 9, name: 'CityCraft Suppliers', rating: 4.5, verified: true, icon: <FactoryIcon /> },
        { id: 10, name: 'BuildRight Partners', rating: 4.8, verified: true, icon: <StorefrontIcon /> },
    ];

    // State to track which filter is active
    const [activeFilter, setActiveFilter] = useState('categories');

    return (
        <div className='mt-10'>
            <div className='flex justify-center p-3'>
                <div className="relative max-w-md md:block w-full">
                    <input
                        type="text"
                        placeholder="What are you looking for?"
                        className="w-full justify-center outline-none border border-gray-200 dark:border-gray-800 p-2 pl-10 rounded-xl dark:bg-gray-900"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>

            <div className="grid md:flex">
                <div className="border dark:border-gray-900 md:w-1/4 h-auto md:h-screen overflow-y-auto max-h-[80vh] m-4 rounded-lg p-1 custom-scrollbar">
                    <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-2 border-b dark:border-gray-800">
                        <div className="flex justify-around text-center">
                            <button
                                className={`py-2 px-4 rounded-lg transition duration-300 flex-1 ${activeFilter === 'categories' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                                onClick={() => setActiveFilter('categories')}
                            >
                                <span className="flex items-center justify-center">
                                    <CategoryIcon className="mr-2" />
                                    Categories
                                </span>
                            </button>
                            <button
                                className={`py-2 px-4 rounded-lg transition duration-300 flex-1 ${activeFilter === 'suppliers' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                                onClick={() => setActiveFilter('suppliers')}
                            >
                                <span className="flex items-center justify-center">
                                    <BusinessIcon className="mr-2" />
                                    Suppliers
                                </span>
                            </button>
                        </div>
                    </div>

                    {activeFilter === 'categories' && (
                        <div className='p-2'>
                            <p className='font-semibold text-xl pt-2'>Categories</p>
                            <div className="p-1 hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300">
                                <Link className='p-1 w-full block'>All Categories</Link>
                            </div>
                            <div className="flex text-left p-1">
                                <ul className="overflow-y-auto w-full">
                                    {category.map((category) => (
                                        <li key={category.id} className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'>
                                            <span className='w-9'><BusinessIcon /></span>
                                            <Link className='p-1 w-full'>{category.category}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeFilter === 'suppliers' && (
                        <div className='p-2'>
                            <p className='font-semibold text-xl pt-2'>Suppliers</p>
                            <div className="p-1 hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300">
                                <Link className='p-1 w-full block'>All Suppliers</Link>
                            </div>
                            <div className="flex text-left p-1">
                                <ul className="overflow-y-auto w-full">
                                    {supplier.map((c) => (
                                        <li key={c.id} className='p-1 flex items-center hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'>
                                            <span className='w-9'><HardwareIcon /></span>
                                            <Link to={`/products/supplier-products/${c.id}`} className='p-1 w-full'>
                                            {console.log(c.id)}
                                                <div className="flex items-center">
                                                    {c.companyName}
                                                    {c.isApproved && (
                                                        <VerifiedIcon className="ml-2 text-blue-500" style={{ fontSize: '1rem' }} />
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Rating: {c.rating}/5
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-1 p-4 custom-scrollbar">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Body;