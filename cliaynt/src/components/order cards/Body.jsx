import React from 'react';
import bannerImage from '../../images/banner2 page2.jpg';
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


function Body() {
    return (
        <div className='mt-10'>
            <div className='flex justify-center p-3'>
                <div className="relative max-w-sm md:block w-full">
                    <input
                        type="text"
                        placeholder="what are you looking for?"
                        className="w-full justify-center outline-none border border-gray-200 dark:border-gray-800 p-2 pl-10 rounded-xl dark:bg-gray-900"
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>

            <div className="grid md:flex">
                <div className="border dark:border-gray-900 md:w-1/4 h-screen overflow-y-auto max-h-80 m-4 rounded-lg p-1 custom-scrollbar">
                    <div>
                        <div className='p-2'>
                            <p className='font-semibold text-xl'>Category</p>
                            <div>All</div>
                            <div className="flex text-left p-3">
                                <ul className="overflow-y-auto w-full"> {/* Ensure scrolling works */}
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'>
                                        <span className='w-9'><FoundationIcon /></span><Link className='p-1 w-full'>Cement & Concrete</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><ConstructionIcon /></span><Link className='p-1 w-full'>Bricks & Blocks</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><HardwareIcon /></span><Link className='p-1 w-full'>Steel & Metal</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><LandscapeIcon /></span><Link className='p-1 w-full'>Sand & Aggregates</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><ForestIcon /></span><Link className='p-1 w-full'>Wood & Timber</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><FormatPaintIcon /></span><Link className='p-1 w-full'>Paints & Finishes</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><PlumbingIcon /></span><Link className='p-1 w-full'>Plumbing & Sanitary</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><ElectricalServicesIcon /></span><Link className='p-1 w-full'>Electrical Materials</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><CategoryIcon /></span><Link className='p-1 w-full'>Miscellaneous</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><RoofingIcon /></span><Link className='p-1 w-full'>Roofing & Insulation</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><DoorSlidingIcon /></span><Link className='p-1 w-full'>Doors & Windows</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><GridOnIcon /></span><Link className='p-1 w-full'>Flooring & Tiles</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><span className='w-9'><ScienceIcon /></span><Link className='p-1 w-full'>Construction Chemicals</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-4 custom-scrollbar">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Body;