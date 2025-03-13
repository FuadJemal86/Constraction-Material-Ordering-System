import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import logo from '../../images/logo constraction.jpeg';
import banner from '../../images/login banner.jpg';
import { Link } from 'react-router-dom';
import api from '../../api';

function CustomerSignIn() {

    const [customer , setCustomer] = useState({
        email:'',
        password:''
        
    })

    const handelSubmit = async(c) => {

        c.preventDefault()

        const {email , password} = customer

        if(!email || !password) {
            return toast.error('fill the input fild')
        }

        try {
            const result = await api.post('/customer/login',customer)

            if(result.data.status) {
                toast.success(result.data.message)
            } else {
                toast.error(result.data.message)
            }
        } catch(err) {
            console.log(err)
            toast.error(err.response.data.message)
        }

    }


    return (
        <div>
            <div className="flex justify-center items-center min-h-screen gap-32">
                <Toaster position="top-center" reverseOrder={false} />
                <form onSubmit={handelSubmit}>
                    <div className="grid gap-5 text-center ml-52">
                        <div className="grid items-center">
                            <img className="w-24 h-24 mx-auto dark:bg-white rounded-full" src={logo} alt="Logo" />
                            <span className="text-xl font-bold font-poppins ">ConstructEasy</span>
                        </div>

                        <div className="grid gap-1">
                            <span className="text-3xl font-bold font-poppins">Welcome Customer!</span>
                            <span className="text-sm font-light font-poppins">
                                have not an account <span><Link to={'/customer-sign-up'} className='text-blue-800 font-bold'>Sign Up</Link></span>
                            </span>
                        </div>

                        <div className='max-w-[336px] grid gap-5'>
                            <div className='grid text-left'>
                                <label className='text-xs mb-1 font-light font-poppins text-gray-500'>Email</label>
                                <input
                                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                    className='w-[336px] h-9 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500'
                                    placeholder='your email'
                                />
                            </div>

                            <div className='grid justify-center text-left'>
                                <lable className='text-xs mb-1 font-light font-poppins text-gray-500'>Password</lable>
                                <input
                                    onChange={e => setCustomer({ ...customer, password: e.target.value })}
                                    placeholder='your password'
                                    className='w-[336px] h-9 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500'
                                />
                            </div>

                            <div>
                                <button className='w-[336px] h-8 mt-4 text-white rounded-xl bg-custom-radial font-poppins font-medium'>
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex justify-end">
                    <div
                        style={{ backgroundImage: `url(${banner})` }}
                        className="bg-cover bg-center w-[500px] h-[650px] rounded-3xl relative"
                    >
                        <div className="absolute bottom-4 text-5xl text-white px-6 py-3 rounded-lg font-bold shadow-lg font-poppins">
                            Welcome to, <br />Login page
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CustomerSignIn
