import React, { useState } from 'react'
import logo from '../../images/logo constraction.jpeg';
import banner from '../../images/login banner.jpg';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

function SignIn() {

    const navigater = useNavigate()
    const [supplier, setSupplier] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { email, password } = supplier

        if (!email || !password) {
            return toast.error('Please fill all fields!')
        }

        try {
            const result = await api.post('/supplier/login', supplier)

            if (result.data.loginStatus) {
                toast.success(result.data.message)
                navigater('/supplier-page')
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
            return toast.error(err.response.data.message || 'An error occurred. Please try again.')
        }
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen gap-8 lg:gap-32 p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                <Toaster position="top-center" reverseOrder={false} />
                <div className=''>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5 text-center ml-52">
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
                                    Already have an account? <span className="text-blue-500 cursor-pointer font-semibold hover:text-blue-700 transition-colors"><Link to={'/sign-up'}>Sign up</Link></span>
                                </span>
                            </div>

                            <div className='max-w-[336px] grid gap-5'>
                                <div className='grid text-left'>
                                    <label className='text-xs mb-1 font-light font-poppins text-gray-500'>Email</label>
                                    <input
                                        onChange={e => setSupplier({ ...supplier, email: e.target.value })}
                                        className='w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md'
                                        placeholder='your email'
                                    />
                                </div>

                                <div className='grid justify-center text-left'>
                                    <lable className='text-xs mb-1 font-light font-poppins text-gray-500'>Password</lable>
                                    <input
                                        onChange={e => setSupplier({ ...supplier, password: e.target.value })}
                                        placeholder='your password'
                                        className='w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md'
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-[336px] h-8 text-white rounded-xl font-poppins font-medium relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:scale-110"></div>
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        <span className="relative z-10">Sign Up</span>
                                    </button>
                                </div>
                            </div>
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

        </div>
    )
}

export default SignIn
