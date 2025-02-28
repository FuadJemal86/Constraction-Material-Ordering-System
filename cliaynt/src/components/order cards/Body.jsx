import React from 'react';
import bannerImage from '../../images/banner2 page2.jpg';
import { Link, Outlet } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

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

            <div className="flex">
                {/* Sidebar */}
                <div className="border dark:border-gray-900 w-1/4 h-screen overflow-y-auto max-h-80 m-4 rounded-lg p-1">
                    <div>
                        <div className='p-2'>
                            <p className='font-semibold text-xl'>Category</p>
                            <div>All</div>
                            <div className="flex text-left p-3">
                                <ul className="overflow-y-auto w-full"> {/* Ensure scrolling works */}
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Cement & Concrete</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Bricks & Blocks</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Steel & Metal</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Sand & Aggregates</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Wood & Timber</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Paints & Finishes</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Plumbing & Sanitary</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Electrical Materials</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Miscellaneous</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Roofing & Insulation</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Doors & Windows</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Flooring & Tiles</Link></li>
                                    <li className='p-1 flex hover:bg-gray-200 hover:text-slate-900 font-semibold transition duration-300 rounded-md dark:hover:bg-slate-600 dark:hover:text-slate-300'><Link className='p-1 w-full'>Construction Chemicals</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Body;