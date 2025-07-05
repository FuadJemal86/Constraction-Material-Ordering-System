import React from 'react';
import { Users, Target, Award, Heart, Globe, Shield, ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';

function AboutUs() {
    const navigator = useNavigate()
    const values = [
        {
            icon: <Shield className="w-8 h-8 text-blue-500" />,
            title: 'Trust & Security',
            description: 'Building secure connections between customers and verified suppliers with complete transparency.'
        },
        {
            icon: <Users className="w-8 h-8 text-purple-500" />,
            title: 'Community First',
            description: 'Fostering strong business relationships that benefit both suppliers and customers equally.'
        },
        {
            icon: <Target className="w-8 h-8 text-green-500" />,
            title: 'Quality Focus',
            description: 'Ensuring every transaction meets the highest standards of quality and reliability.'
        },
        {
            icon: <Globe className="w-8 h-8 text-orange-500" />,
            title: 'Ethiopian Reach',
            description: 'Empowering businesses throughout Ethiopia to build connections and foster sustainable development.'
        }

    ];

    const stats = [
        { number: '50', label: 'Active Suppliers' },
        { number: '200', label: 'Happy Customers' },
        { number: '33+', label: 'Successful Orders' },
        { number: '40.9%', label: 'Platform Uptime' }
    ];

    const handleNavigation = () => {
        navigator('/products')
    }

    return (
        <div>
            <Header />
            <div className='w-full overflow-x-hidden'>
                {/* Hero Section */}
                <section className="relative w-full h-[80vh] min-h-[500px] bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800  dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-bl-[40px] rounded-br-[40px] bg-white">
                    <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-60"></div>
                    <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-blue-900/20 dark:to-gray-900/40"></div>
                    <div className="relative z-10 flex items-center justify-center h-full px-4">
                        <div className="text-center text-white max-w-4xl">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                About
                                <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    Jejan Marketplace
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
                                Connecting customers with trusted suppliers to build lasting business relationships and drive mutual success.
                            </p>
                        </div>
                    </div>

                    {/* Animated background elements */}
                    <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-400 dark:bg-cyan-400 rounded-full opacity-20 dark:opacity-30 animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-12 h-12 bg-pink-400 dark:bg-purple-400 rounded-full opacity-20 dark:opacity-30 animate-bounce"></div>
                    <div className="absolute bottom-20 left-1/4 w-10 h-10 bg-green-400 dark:bg-blue-400 rounded-full opacity-20 dark:opacity-30 animate-pulse"></div>
                </section>

                {/* Our Story Section */}
                <section className="py-20 px-4 md:px-10 lg:px-20 bg-white dark:bg-gray-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8">
                            Our Story
                        </h2>
                        <div className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed space-y-6">
                            <p>
                                Jejan Marketplace was born from a simple yet powerful vision: to create a platform where customers and suppliers can connect with complete trust and transparency. We recognized the challenges businesses face when searching for reliable suppliers and quality products.
                            </p>
                            <p>
                                Our platform bridges the gap between supply and demand, ensuring that every connection made leads to successful, long-term business relationships. We believe in the power of trust, quality, and mutual growth.
                            </p>
                            <p>
                                Today, Jejan serves as a trusted intermediary, helping thousands of businesses find the right partners to scale their operations and achieve their goals.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 px-4 md:px-10 lg:px-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-cyan-400 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Values Section */}
                <section className="py-20 px-4 md:px-10 lg:px-20 bg-gray-50 dark:bg-gray-900">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            Our Values
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                            The principles that guide everything we do and shape our commitment to excellence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                                <div className="mb-6 group-hover:scale-110 transition duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="py-20 px-4 md:px-10 lg:px-20 bg-white dark:bg-gray-800">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-700 rounded-2xl">
                                <div className="flex items-center mb-6">
                                    <Target className="w-10 h-10 text-blue-500 mr-4" />
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Our Mission</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    To revolutionize the way businesses connect by providing a secure, transparent, and efficient marketplace that empowers both customers and suppliers to achieve sustainable growth through trusted partnerships.
                                </p>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-700 rounded-2xl">
                                <div className="flex items-center mb-6">
                                    <Award className="w-10 h-10 text-purple-500 mr-4" />
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Our Vision</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    To become the world's most trusted marketplace platform, where every business connection leads to mutual success, innovation, and long-term prosperity for all stakeholders in the global economy.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tech Reach Section */}
                <section className="py-20 px-4 md:px-10 lg:px-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                                Developed by Tech Reach Software
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                                Jejan Marketplace is proudly developed and maintained by Tech Reach Software Company, a leading technology solutions provider committed to building innovative platforms that drive business growth and success.
                            </p>
                            <div className="flex items-center justify-center text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition duration-300">
                                <Link to={`https://officaltechreach.vercel.app/`} className="mr-2 font-semibold">Visit Tech Reach Software</Link>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                officaltechreach.vercel.app
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 md:px-10 lg:px-20">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-12 md:p-16 rounded-3xl shadow-2xl dark:shadow-purple-900/50 text-center text-white relative overflow-hidden border dark:border-purple-500/20">
                        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-cyan-900/20 dark:via-purple-900/30 dark:to-gray-900/40"></div>
                        <div className="relative z-10">
                            <Heart className="w-16 h-16 mx-auto mb-6 text-pink-300 dark:text-cyan-300" />
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:bg-gradient-to-r dark:from-cyan-300 dark:to-purple-300 dark:bg-clip-text dark:text-transparent">
                                Join Our Growing Community
                            </h2>
                            <p className="text-xl mb-8 text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
                                Become part of a thriving ecosystem where trust, quality, and success go hand in hand. Start building meaningful business relationships today.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={handleNavigation} className="px-8 py-4 bg-white text-blue-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-purple-500 dark:text-white font-bold rounded-full hover:bg-gray-100 dark:hover:from-cyan-600 dark:hover:to-purple-600 transform hover:scale-105 transition duration-300 shadow-lg dark:shadow-cyan-500/25">
                                    Get Started Today
                                </button>
                            </div>
                        </div>

                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-cyan-400 opacity-5 dark:opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white dark:bg-purple-400 opacity-5 dark:opacity-10 rounded-full transform -translate-x-24 translate-y-24"></div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default AboutUs;