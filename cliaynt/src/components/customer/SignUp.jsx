import React, { useState } from 'react'
import logo from '../../images/logo constraction.jpeg';
import banner from '../../images/login banner.jpg';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../../api';

function SignUp() {

    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        image: ''
    })


    const [agree, setAgree] = useState(false)


    const handelSubmit = async (c) => {

        c.preventDefault()

        const { name, email, password, phone } = customer

        if (!name || !email || !password || !phone) {
            return toast.error('fill the input filed')
        }

        if (!agree) {
            return toast.error('muste be aggred')
        }

        try {
            const result = await api.post('/customer/sign-up', customer)

            if (result.data.status) {
                toast.success(result.data.message)
            } else {
                toast.error(result.data.message)
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message)
        }
    }


    return (
        <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen gap-8 lg:gap-32 p-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="grid gap-5 text-center lg:ml-52">
                <div className="grid items-center">
                    <div className="relative mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-70"></div>
                        <img className="relative w-24 h-24 mx-auto bg-white rounded-full border-2 border-white shadow-lg" src={logo} alt="Logo" />
                    </div>
                    <span className="text-xl font-bold font-poppins mt-2 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">ConstructEasy</span>
                </div>

                <div className="grid gap-1">
                    <span className="text-3xl font-bold font-poppins dark:text-gray-400">Create your account.</span>
                    <span className="text-sm font-light font-poppins dark:text-gray-400">
                        Already have an account? <span className="text-blue-500 cursor-pointer font-semibold"><Link to={'/customer-sign-in'}>Sign in</Link></span>
                    </span>
                </div>

                <form onSubmit={handelSubmit}>
                    <div className="max-w-[336px] grid gap-3">
                        <div className="grid text-left">
                            <label className="text-xs mb-1 font-light font-poppins text-gray-500">Full name</label>
                            <input
                                value={customer.companyName}
                                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                className="w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
                                placeholder="Your name"
                            />
                        </div>

                        <div className="flex gap-3">
                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">Email </label>
                                <input
                                    value={customer.email}
                                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
                                    placeholder="example@gmail.com"
                                />
                            </div>

                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">Password</label>
                                <input
                                    value={customer.password}
                                    onChange={e => setCustomer({ ...customer, password: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
                                    placeholder="******"
                                />
                            </div>
                        </div>

                        <div className="grid text-left">
                            <label className="text-xs mb-1 font-light font-poppins text-gray-500">Phone</label>
                            <input
                                value={customer.companyName}
                                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                placeholder="+251 902 920301"
                                className="w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-gray-500 transition shadow-sm hover:shadow-md"
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={() => setAgree(!agree)}
                                className="w-3 h-3 cursor-pointer"
                            />
                            <span className="text-xs font-thin font-poppins text-gray-500">
                                I agree to the <span className="text-blue-500 cursor-pointer font-semibold">terms and conditions</span>
                            </span>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-[336px] h-8 text-white rounded-xl font-poppins font-medium relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:scale-110"></div>
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <span className="relative z-10">Login</span>
                            </button>
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
    )
}

export default SignUp
