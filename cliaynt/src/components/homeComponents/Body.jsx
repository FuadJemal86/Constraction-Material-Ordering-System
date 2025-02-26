import React from 'react';
import banner from '../../images/image1_0.jpg'




function Body() {
    return (
        <div className='mt-20'>
            <div>
                <div>
                    <div>
                        <div className='flex justify-center'>
                            <div className='text-left w-1/2 p-5 mr-4'>
                                <div className='text-5xl'>StereamLine Your Constaraction Material Ordering Today</div>
                                <div className='text-sm pt-5'>Discover an efficent way to manage your constraction material needs.
                                    ouer platform connect you with trust suppliayers for seamless ordering and tracking
                                </div>

                                <div className='pt-10 flex gap-3'>
                                    <button className='border  rounded-full px-4 py-2 text-sm font-medium bg-fuchsia-500 text-white'>Get Started</button>
                                    <button className='border rounded-full px-4 py-2 text-sm font-medium'>Learn More</button>
                                </div>

                            </div>

                            <div className='ml-4'>
                                <img className='w-96 h-96 rounded-2xl' src={banner} alt="" srcset="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-40 mb-40 mx-14'>
                <div className='flex'>
                    <div className='w-full'>
                        <div className='text-2xl'>Join Ouer Constraction Network</div>
                        <div className='text-sm'>connect with suppliers and strimline your material order.</div>
                    </div>

                    <div className='flex gap-3 w-full justify-end'>
                        <div className='border rounded-3xl bg-fuchsia-500 flex items-center'>
                            <button className='px-4 py-1 text-sm font-medium  text-white'>Sign Up</button>
                        </div>
                        <div className='border rounded-3xl  flex items-center'>
                            <button className='px-4 py-1 text-sm font-medium  '>Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Body
