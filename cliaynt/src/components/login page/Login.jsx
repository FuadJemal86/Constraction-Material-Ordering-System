import React, { useState } from 'react';
import logo from '../../images/logo constraction.jpeg';
import banner from '../../images/login banner.jpg';
import api from '../../api';
import { Toaster, toast } from 'react-hot-toast';
import { Notyf } from 'notyf';
import { Link, useNavigate } from 'react-router-dom';
import 'notyf/notyf.min.css';

function Login() {
    const notyf = new Notyf();
    const navigate = useNavigate()
    const [supplier, setSupplier] = useState({
        companyName: "",
        email: "",
        phone: "",
        address: "",
        tinNumber: "",
        licenseNumber: "",
        password: ""
    });

    const [agree, setAgree] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { companyName, email, phone, address, tinNumber, licenseNumber, password } = supplier;

        if (!companyName || !email || !phone || !address || !tinNumber || !licenseNumber || !password) {
            return toast.error('Please fill all fields!');
        }

        const tinRegex = /^\d{10}$/;
        if (!tinRegex.test(tinNumber)) {
            return toast.error('Invalid TIN Number. It must be 10 digits.')
        }

        const licenseRegex = /^[A-Z]{2,3}\/\d{3,6}\/\d{4}$/;
        if (!licenseRegex.test(licenseNumber)) {
            return toast.error('Invalid License Number format.')
        }

        if (!agree) {
            return toast.error("You must agree to the terms and conditions.");
        }

        try {
            const result = await api.post('/supplier/sign-up', supplier);

            if (result.data.status) {
                notyf.success('Your data will be processed');

                navigate('/supplier-page')

            } else {
                toast.error(result.data.message || 'Signup failed!');
            }
        } catch (err) {
            const errorMessage = err.response.data.message || 'An error occurred. Please try again.';
            toast.error(errorMessage);
            console.error(err);
        }
    };

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
                        Already have an account? <span className="text-blue-500 cursor-pointer font-semibold"><Link to={'/sign-in'}>Sign in</Link></span>
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="max-w-[336px] grid gap-3">
                        <div className="grid text-left">
                            <label className="text-xs mb-1 font-light font-poppins text-gray-500">Full name / Company name</label>
                            <input
                                value={supplier.companyName}
                                onChange={e => setSupplier({ ...supplier, companyName: e.target.value })}
                                className="w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
                                placeholder="Your name"
                            />
                        </div>

                        <div className="flex gap-3">
                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">Email address</label>
                                <input
                                    value={supplier.email}
                                    onChange={e => setSupplier({ ...supplier, email: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
                                    placeholder="example@gmail.com"
                                />
                            </div>

                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">Phone number</label>
                                <input
                                    value={supplier.phone}
                                    onChange={e => setSupplier({ ...supplier, phone: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
                                    placeholder="+251 902 920301"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">TIN number</label>
                                <input
                                    value={supplier.tinNumber}
                                    onChange={e => setSupplier({ ...supplier, tinNumber: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
                                    placeholder='**** **** **'
                                />
                            </div>

                            <div className="grid text-left">
                                <label className="text-xs mb-1 font-light font-poppins text-gray-500">Password</label>
                                <input
                                    type="password"
                                    value={supplier.password}
                                    onChange={e => setSupplier({ ...supplier, password: e.target.value })}
                                    className="w-[162px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
                                    placeholder="*****"
                                />
                            </div>
                        </div>

                        <div className="grid text-left">
                            <label className="text-xs mb-1 font-light font-poppins text-gray-500">Company Address</label>
                            <input
                                value={supplier.address}
                                onChange={e => setSupplier({ ...supplier, address: e.target.value })}
                                placeholder="-------"
                                className="w-[336px] h-8 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500"
                            />
                        </div>

                        <div className="grid text-left">
                            <label className="text-xs mb-1 font-light font-poppins text-gray-500">Business license number</label>
                            <input
                                value={supplier.licenseNumber}
                                onChange={e => setSupplier({ ...supplier, licenseNumber: e.target.value })}
                                placeholder="MT/1234/2015"
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
    );
}

export default Login;
