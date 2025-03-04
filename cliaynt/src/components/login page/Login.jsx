import React from 'react'
import logo from '../../images/logo constraction.jpeg'
import banner from '../../images/login banner.jpg'

function Login() {
    return (
        <div className="flex justify-center items-center min-h-screen gap-32">
            <div className="grid gap-5 text-center ml-52">
                <div className="grid items-center">
                    <img className="w-24 h-24 mx-auto " src={logo} alt="Logo" />
                    <span className="text-xl font-bold font-poppins">ConstructEasy</span>
                </div>

                <div className="grid gap-1">
                    <span className="text-3xl font-bold font-poppins">Create your account.</span>
                    <span className="text-sm font-light font-poppins">
                        Already have an account? <span className="text-blue-500 cursor-pointer font-semibold">Sign in</span>
                    </span>
                </div>

                <div className='max-w-[336px] grid gap-3'>
                    <div className='grid text-left'>
                        <label className='text-xs mb-1 font-light font-poppins text-gray-500'>Full name / Company name</label>
                        <input
                            className='w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition'
                            placeholder='fuad jemal'
                        />
                    </div>

                    <div className='flex gap-3'>
                        <div className='grid text-left'>
                            <lable className='text-xs mb-1 font-light font-poppins text-gray-500'>Email address</lable>
                            <input
                                className='w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition'
                                placeholder='fuad jemal'
                            />
                        </div>

                        <div className='grid text-left'>
                            <lable className='text-xs mb-1 font-light font-poppins text-gray-500'>Phone number</lable>
                            <input
                                className='w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition'
                                placeholder='fuad jemal'
                            />
                        </div>
                    </div>

                    <div className='flex gap-3'>
                        <div className='grid text-left'>
                            <lable className='text-xs mb-1 font-light font-poppins text-gray-500'>TIN number</lable>
                            <input
                                className='w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition'
                                placeholder='fuad jemal'
                            />
                        </div>

                        <div className='grid text-left'>
                            <lable className='text-xs mb-1 font-light font-poppins text-gray-500'>Password</lable>
                            <input
                                className='w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition'
                                placeholder='fuad jemal'
                            />
                        </div>
                    </div>

                    <div className='grid justify-center text-left'>
                        <lable className='text-xs mb-1 font-light font-poppins text-gray-500'>Company Address</lable>
                        <input
                            placeholder='-------'
                            className='w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition'
                        />
                    </div>

                    <div className='grid justify-center text-left'>
                        <lable className='text-xs mb-1 font-thin font-poppins text-gray-500'>Bussines license number</lable>
                        <input
                            placeholder='*****'
                            className='w-[px] h-8 border p-1 rounded-lg text-base border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition'
                        />
                    </div>

                    <div className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            className='w-3 h-3'

                        />
                        <span className='text-xs mb-1 font-thin font-poppins text-gray-500'> i agree to the term and condition</span>
                    </div>

                    <div>
                        <button className='w-[336px] h-8 text-white rounded-xl bg-custom-radial font-poppins font-medium'>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <div
                    style={{ backgroundImage: `url(${banner})` }}
                    className="bg-cover bg-center w-[500px] h-[650px] rounded-3xl relative"
                >
                    <div className="absolute bottom-4 text-5xl text-white px-6 py-3 rounded-lg font-bold shadow-lg font-poppins">
                        Quality Materials, <br /> Solid Result
                    </div>
                </div>
            </div>



        </div>

    )
}

export default Login
