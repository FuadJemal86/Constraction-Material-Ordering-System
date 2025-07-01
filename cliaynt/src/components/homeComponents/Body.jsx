import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Truck, Shield, Star, Tag, Gift, CreditCard } from 'lucide-react';

function Body() {
    const [activeTab, setActiveTab] = useState('suppliers');
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const services = [
        {
            id: 'suppliers',
            title: 'Trusted Suppliers',
            icon: <ShoppingBag className="w-10 h-10 text-blue-500" />,
            description: 'Connect with verified suppliers offering quality products and reliable service.'
        },
        {
            id: 'delivery',
            title: 'Direct Delivery',
            icon: <Truck className="w-10 h-10 text-blue-500" />,
            description: 'Get products delivered directly from suppliers to your location with real-time tracking.'
        },
        {
            id: 'security',
            title: 'Secure Transactions',
            icon: <Shield className="w-10 h-10 text-blue-500" />,
            description: 'Safe and secure payment processing with buyer protection and supplier verification.'
        },
        {
            id: 'support',
            title: 'Partnership Support',
            icon: <Star className="w-10 h-10 text-blue-500" />,
            description: 'Dedicated support team to help maintain strong supplier-customer relationships.'
        }
    ];

    const features = [
        {
            icon: <Tag className="w-8 h-8 text-green-500" />,
            title: 'Competitive Pricing',
            description: 'Direct supplier pricing with no middleman markup'
        },
        {
            icon: <Gift className="w-8 h-8 text-purple-500" />,
            title: 'Bulk Discounts',
            description: 'Special pricing for larger orders and loyal customers'
        },
        {
            icon: <CreditCard className="w-8 h-8 text-orange-500" />,
            title: 'Flexible Terms',
            description: 'Customizable payment and delivery terms with suppliers'
        },
        {
            icon: <Shield className="w-8 h-8 text-red-500" />,
            title: 'Quality Assurance',
            description: 'All suppliers vetted for quality and reliability standards'
        }
    ];

    const handleNavigation = () => {
        console.log('Navigating to products...');
    }

    return (
        <div className="w-full overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
            {/* Hero Section - Full Width Banner */}
            <section className="relative w-full h-[80vh] min-h-[500px] bg-gradient-to-r from-yellow-400 to-pink-400 dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-bl-[40px] rounded-br-[40px] bg-white">
                <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 rounded-bl-[40px] rounded-br-[40px]"></div>
                <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-blue-900/20 dark:to-gray-900/40"></div>
                <div className="relative z-10 flex items-center justify-center h-full px-4">
                    <div
                        className="text-center text-white max-w-4xl transform transition-all duration-1000 ease-out"
                        style={{
                            transform: `translateY(${scrollY * 0.1}px)`,
                            opacity: Math.max(0, 1 - scrollY / 800)
                        }}
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-300">
                            Welcome to
                            <span className="block bg-gradient-to-r text-white from-yellow-400 to-pink-400 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Jejan Marketplace
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-200 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-500">
                            Discover trusted suppliers and explore a wide range of quality products.
                            Start building strong business relationships and grow with Jejan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-700">
                            <button onClick={handleNavigation} className="px-8 py-4 bg-white dark:from-cyan-500 dark:to-purple-500 text-black font-semibold rounded-full hover:from-yellow-600 hover:to-yellow-700 dark:hover:from-cyan-600 dark:hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg dark:shadow-cyan-500/25">
                                Find Suppliers
                            </button>
                            <button onClick={handleNavigation} className="px-8 py-4 border-2 border-white dark:border-cyan-400 text-white dark:text-cyan-400 font-semibold rounded-full hover:bg-white hover:text-gray-900 dark:hover:bg-cyan-400 dark:hover:text-gray-900 transition-all duration-300">
                                Browse Products
                            </button>
                        </div>
                    </div>
                </div>

                {/* Animated background elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 dark:bg-cyan-400 rounded-full opacity-20 dark:opacity-30 animate-pulse"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400 dark:bg-purple-400 rounded-full opacity-20 dark:opacity-30 animate-bounce"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400 dark:bg-blue-400 rounded-full opacity-20 dark:opacity-30 animate-pulse"></div>
                <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-blue-400 dark:bg-pink-400 rounded-full opacity-10 dark:opacity-20 animate-ping"></div>
                <div className="absolute bottom-32 right-10 w-14 h-14 bg-purple-400 dark:bg-yellow-400 rounded-full opacity-15 dark:opacity-25 animate-pulse"></div>
            </section>

            {/* Services Section */}
            <section className="py-20 px-4 md:px-10 lg:px-20 bg-gray-50 dark:bg-gray-900">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in-up">
                        Why Choose Our Platform?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
                        Experience seamless supplier-customer connections with our comprehensive platform designed for business growth
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => setActiveTab(service.id)}
                        >
                            <div className="mb-6 group-hover:scale-110 transition-all duration-300">{service.icon}</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{service.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{service.description}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === service.id
                                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                                    : 'text-gray-500 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-105'
                                    }`}
                                onClick={() => setActiveTab(service.id)}
                            >
                                {service.title}
                            </button>
                        ))}
                    </div>
                    <div className="py-6 text-gray-700 dark:text-gray-300 text-lg transition-all duration-500 animate-fade-in">
                        {services.find(s => s.id === activeTab).description}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 md:px-10 lg:px-20 bg-white dark:bg-gray-800">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in-up">
                        How It Works
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
                        Three simple steps to connect with suppliers and start building profitable business relationships
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 max-w-6xl mx-auto">
                    <div className="flex flex-col items-center text-center max-w-sm animate-fade-in-up delay-300">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                            <span className="text-3xl font-bold text-white">1</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Connect & Browse</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Find and connect with verified suppliers in your area or industry of interest
                        </p>
                    </div>

                    <ArrowRight className="hidden lg:block w-8 h-8 text-gray-400 transform rotate-0 lg:rotate-0 animate-pulse" />

                    <div className="flex flex-col items-center text-center max-w-sm animate-fade-in-up delay-500">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                            <span className="text-3xl font-bold text-white">2</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Negotiate & Order</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Discuss terms, pricing, and quantities directly with suppliers to get the best deals
                        </p>
                    </div>

                    <ArrowRight className="hidden lg:block w-8 h-8 text-gray-400 animate-pulse" />

                    <div className="flex flex-col items-center text-center max-w-sm animate-fade-in-up delay-700">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                            <span className="text-3xl font-bold text-white">3</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Receive & Grow</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Get your products delivered and build long-term partnerships for sustained business growth
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 md:px-10 lg:px-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in-up">
                        Partnership Benefits
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
                        Enjoy exclusive benefits designed to strengthen supplier-customer relationships and boost your business success
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 animate-fade-in-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="mb-6 group-hover:scale-110 transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 md:px-10 lg:px-20">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-12 md:p-16 rounded-3xl shadow-2xl dark:shadow-purple-900/50 text-center text-white relative overflow-hidden border dark:border-purple-500/20 animate-fade-in-up">
                    <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-cyan-900/20 dark:via-purple-900/30 dark:to-gray-900/40"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:bg-gradient-to-r dark:from-cyan-300 dark:to-purple-300 dark:bg-clip-text dark:text-transparent">
                            Ready to Build Strong Partnerships?
                        </h2>
                        <p className="text-xl mb-8 text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
                            Join thousands of successful businesses already using our platform to connect with reliable suppliers and grow their operations.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={handleNavigation} className="px-8 py-4 bg-white text-blue-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-purple-500 dark:text-white font-bold rounded-full hover:bg-gray-100 dark:hover:from-cyan-600 dark:hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg dark:shadow-cyan-500/25">
                                Start Connecting
                            </button>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-cyan-400 opacity-5 dark:opacity-10 rounded-full transform translate-x-32 -translate-y-32 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white dark:bg-purple-400 opacity-5 dark:opacity-10 rounded-full transform -translate-x-24 translate-y-24 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-400 dark:bg-blue-400 opacity-5 dark:opacity-15 rounded-full transform -translate-x-16 -translate-y-16 animate-pulse"></div>
                </div>
            </section>

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                .delay-200 {
                    animation-delay: 200ms;
                }

                .delay-300 {
                    animation-delay: 300ms;
                }

                .delay-500 {
                    animation-delay: 500ms;
                }

                .delay-700 {
                    animation-delay: 700ms;
                }

                html {
                    scroll-behavior: smooth;
                }

                .transition-all {
                    transition-property: all;
                }
            `}</style>
        </div>
    );
}

export default Body;