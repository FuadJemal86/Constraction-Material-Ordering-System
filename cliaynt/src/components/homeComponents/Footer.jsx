import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaArrowUp, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

// Mock logo component since we can't import the actual SVG
const Logo = () => (
    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        Jejan
    </div>
);

function Footer() {
    const navigator = useNavigate()

    const [showScrollTop, setShowScrollTop] = useState(false);
    const [currentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNaviget = () => {
        window.open('https://officaltechreach.vercel.app/', '_blank');
    };

    const handleNavigetAbout = () => {
        // navigatore('/about-us')
        console.log('Navigate to about us');
    };

    const socialLinks = [
        { icon: FaFacebook, color: 'hover:text-blue-600', label: 'Facebook', to: 'https://web.facebook.com/profile.php?id=61578119967494' },
        { icon: FaInstagram, color: 'hover:text-pink-500', label: 'Instagram' },
        { icon: FaGithub, color: 'hover:text-gray-800 dark:hover:text-white', label: 'GitHub', to: 'https://github.com/FuadJemal86' },
        { icon: FaLinkedin, color: 'hover:text-blue-700', label: 'LinkedIn' }
    ];

    return (
        <footer className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 text-gray-700 dark:text-gray-300 transition-all duration-300">

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <Logo />
                            <div className="h-8 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                            <span className="text-lg font-semibold">E-Commerce</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                            Your trusted partner for premium products and exceptional shopping experience.
                            We bring quality and innovation to your doorstep.
                        </p>

                        {/* Contact info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <FaEnvelope className="text-blue-500" />
                                <span>officaltechreach@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <FaPhone className="text-green-500" />
                                <span>+251 9029 20301</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>Ethiopia , Hawassa</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 pb-2 inline-block">
                            Quick Links
                        </h3>
                        <nav>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Contact Us', action: handleNaviget },
                                    { label: 'About Us', action: handleNavigetAbout },
                                    { label: 'supplier', action: () => navigator('/sign-up') },
                                    { label: 'shoppe', action: () => navigator('/products') },
                                ].map((item, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={item.action}
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform"
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Newsletter signup */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-purple-500 pb-2 inline-block">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Subscribe to our newsletter for latest updates and exclusive offers.
                        </p>
                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            />
                            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social media section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Follow us on:</span>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <a

                                    key={index}
                                    href={social.to}
                                    className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 text-gray-600 dark:text-gray-400 ${social.color}`}
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Back to top button */}
                    {showScrollTop && (
                        <button
                            onClick={scrollToTop}
                            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 z-50"
                            aria-label="Back to top"
                        >
                            <FaArrowUp size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom section */}
            <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © {currentYear} Jejan E-Commerce. All rights reserved.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Developed with</span>
                            <FaHeart className="text-red-500 animate-pulse" />
                            <span>by</span>
                            <button
                                onClick={handleNaviget}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                            >
                                Tech Reach
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;