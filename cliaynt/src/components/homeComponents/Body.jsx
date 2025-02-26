import React, { useState } from 'react';
import banner from '../../images/image1_0.jpg';
import { ArrowRight, Building, TruckIcon, ClipboardCheck, Users } from 'lucide-react';

function Body() {
    const [activeTab, setActiveTab] = useState('suppliers');

    const services = [
        {
            id: 'suppliers',
            title: 'Trusted Suppliers',
            icon: <TruckIcon className="w-10 h-10 text-fuchsia-500" />,
            description: 'Access our network of vetted suppliers offering quality materials at competitive prices.'
        },
        {
            id: 'ordering',
            title: 'Easy Ordering',
            icon: <ClipboardCheck className="w-10 h-10 text-fuchsia-500" />,
            description: 'Place orders with just a few clicks, track deliveries, and manage everything in one place.'
        },
        {
            id: 'projects',
            title: 'Project Management',
            icon: <Building className="w-10 h-10 text-fuchsia-500" />,
            description: 'Organize materials by project, set schedules, and keep everything on track.'
        },
        {
            id: 'network',
            title: 'Contractor Network',
            icon: <Users className="w-10 h-10 text-fuchsia-500" />,
            description: 'Connect with other professionals to share resources and collaborate on projects.'
        }
    ];

    // Testimonials data
    const testimonials = [
        {
            name: "Sarah Johnson",
            company: "Johnson Construction",
            text: "This platform has cut our ordering time in half. Materials arrive on schedule every time."
        },
        {
            name: "Michael Rodriguez",
            company: "Rodriguez Builders",
            text: "The supplier network is excellent, and the order tracking feature has saved us countless hours."
        },
        {
            name: "Amy Chen",
            company: "Chen Properties",
            text: "Easy to use, great customer service, and helps us stay organized across multiple projects."
        }
    ];

    return (
        <div className="w-full overflow-x-hidden mt-8">
            {/* Hero Section */}
            <section className="mt-8 md:mt-20 px-4 md:px-10 lg:px-20">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-left w-full md:w-1/2 p-2 md:p-5 md:pr-8 mb-8 md:mb-0">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                            Streamline Your Construction Material Ordering Today
                        </h1>
                        <p className="text-sm md:text-base pt-3 md:pt-5 text-gray-600">
                            Discover an efficient way to manage your construction material needs.
                            Our platform connects you with trusted suppliers for seamless ordering and tracking.
                        </p>

                        <div className="pt-6 md:pt-10 flex gap-3">
                            <button className="border rounded-full px-4 py-2 text-sm font-medium bg-fuchsia-500 text-white hover:bg-fuchsia-600 transition duration-300">
                                Get Started
                            </button>
                            <button className="border rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100 transition duration-300">
                                Learn More
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                        <img
                            className="w-full max-w-md h-auto rounded-2xl shadow-lg object-cover"
                            src={banner}
                            alt="Construction materials"
                        />
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="mt-20 md:mt-32 px-4 md:px-10 lg:px-20 bg-gray-50 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Our Services</h2>
                    <p className="text-gray-600 mt-2">Everything you need to manage your construction materials</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                            onClick={() => setActiveTab(service.id)}
                        >
                            <div className="mb-4">{service.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
                    <div className="mb-4 flex border-b">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                className={`px-4 py-2 text-sm font-medium mr-2 ${activeTab === service.id
                                        ? 'border-b-2 border-fuchsia-500 text-fuchsia-500'
                                        : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                onClick={() => setActiveTab(service.id)}
                            >
                                {service.title}
                            </button>
                        ))}
                    </div>
                    <div className="py-4">
                        {services.find(s => s.id === activeTab).description}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="mt-20 px-4 md:px-10 lg:px-20">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">How It Works</h2>
                    <p className="text-gray-600 mt-2">Simple steps to optimize your material management</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center text-center p-4 max-w-xs">
                        <div className="w-16 h-16 rounded-full bg-fuchsia-100 flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-fuchsia-500">1</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                        <p className="text-gray-600 text-sm">Create your account and set up your company profile</p>
                    </div>

                    <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />

                    <div className="flex flex-col items-center text-center p-4 max-w-xs">
                        <div className="w-16 h-16 rounded-full bg-fuchsia-100 flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-fuchsia-500">2</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Connect</h3>
                        <p className="text-gray-600 text-sm">Browse our network of suppliers and add them to your contacts</p>
                    </div>

                    <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />

                    <div className="flex flex-col items-center text-center p-4 max-w-xs">
                        <div className="w-16 h-16 rounded-full bg-fuchsia-100 flex items-center justify-center mb-4">
                            <span className="text-2xl font-bold text-fuchsia-500">3</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Order</h3>
                        <p className="text-gray-600 text-sm">Place orders, track deliveries, and manage your inventory</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="mt-20 md:mt-32 px-4 md:px-10 lg:px-20 bg-gray-50 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">What Our Clients Say</h2>
                    <p className="text-gray-600 mt-2">Trusted by construction professionals nationwide</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                            <div className="mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                            <div className="font-semibold">{testimonial.name}</div>
                            <div className="text-sm text-gray-500">{testimonial.company}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="mt-20 md:mt-32 mb-20 md:mb-32 mx-4 md:mx-14">
                <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0 text-center md:text-left">
                            <h2 className="text-xl md:text-2xl font-bold mb-2">Join Our Construction Network</h2>
                            <p className="text-sm md:text-base text-gray-600">Connect with suppliers and streamline your material orders.</p>
                        </div>

                        <div className="flex gap-3">
                            <button className="border rounded-full px-6 py-2 text-sm font-medium bg-fuchsia-500 text-white hover:bg-fuchsia-600 transition duration-300">
                                Sign Up
                            </button>
                            <button className="border rounded-full px-6 py-2 text-sm font-medium hover:bg-gray-100 transition duration-300">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Body;