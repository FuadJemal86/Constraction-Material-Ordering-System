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
        phone: ''
    })


    const [agree , setAgree] = useState(false)


    const handelSubmit = async (c) => {

        c.preventDefault()

        const { name, email, password, phone } = customer

        if (!name || !email || !password || !phone) {
            return toast.error('fill the input filed')
        }

        if(!agree) {
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
        <div className="flex justify-center items-center min-h-screen gap-32">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="grid gap-5 text-center ml-52">
                <div className="grid items-center">
                    <img className="w-24 h-24 mx-auto dark:bg-white rounded-full" src={logo} alt="Logo" />
                    <span className="text-xl font-bold font-poppins dark:text-gray-400">ConstructEasy</span>
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
                                className="w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
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

                        <button type="submit" className="w-[336px] h-8 text-white rounded-xl bg-custom-radial font-poppins font-medium">
                            Sign Up
                        </button>
                    </div>
                </form>
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

export default SignUp
