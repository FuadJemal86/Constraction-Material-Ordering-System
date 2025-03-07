import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Wrench, ChevronDown } from 'lucide-react';
import logo from '../../images/logo constraction.jpeg';
import '@fontsource/roboto';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        // Handle scroll effect for header
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handelSection = (id) => {
        const section = document.getElementById(id)

        if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <header className={`w-full fixed top-0 z-50 transition-all duration-300 dark:bg-gray-900 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'
            }`}>
            <div className="container mx-auto px-4 sm:px-6">
                <nav className="flex items-center justify-between h-16 sm:h-18 md:h-20" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img className='w-12 h-12 dark:bg-white rounded-full m-1' src={logo} alt="" srcset="" />
                            <span className="font-bold text-lg sm:text-xl">ConstructEase</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center space-x-4 lg:space-x-8 ">
                        <li>
                            <Link to="/" className="text-gray-700 dark:text-white hover:text-fuchsia-500 font-medium transition-colors text-sm lg:text-base">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link onClick={() => handelSection('about-us')} className="text-gray-700 dark:text-white hover:text-fuchsia-500 font-medium transition-colors text-sm lg:text-base">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-gray-700 dark:text-white hover:text-fuchsia-500 font-medium transition-colors text-sm lg:text-base">
                                Contact Us
                            </Link>
                        </li>
                        <li className="relative">
                            <button
                                className="flex items-center text-gray-700 dark:text-white hover:text-fuchsia-500 font-medium transition-colors text-sm lg:text-base"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                Services <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-20 dark:bg-gray-900">
                                    <Link
                                        to="/products"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Materials
                                    </Link>
                                    <Link
                                        to="/services/ordering"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Ordering
                                    </Link>
                                    <Link
                                        to="/services/tracking"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Tracking
                                    </Link>
                                </div>
                            )}
                        </li>
                    </ul>

                    {/* CTA Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <Link to="/products" className="border border-gray-300 rounded-full px-3 py-1.5 lg:px-5 lg:py-2 text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm lg:text-base dark:text-white dark:hover:bg-gray-500">
                            Materials
                        </Link>
                        <Link to="/sign-up" className="border border-fuchsia-500 bg-fuchsia-500 rounded-full px-3 py-1.5 lg:px-5 lg:py-2 text-white font-medium hover:bg-fuchsia-600 hover:border-fuchsia-600 transition-colors text-sm lg:text-base">
                            Post Now
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu - Animated Slide Down */}
            <div
                className={`md:hidden bg-white border-t dark:bg-gray-900 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen
                        ? 'max-h-screen opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
            >
                <ul className="flex flex-col py-4 px-6 space-y-4">
                    <li>
                        <Link
                            to="/"
                            className="block text-gray-700 dark:text-white hover:text-fuchsia-500 font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/about"
                            className="block text-gray-700 dark:text-white hover:text-fuchsia-500 font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contact"
                            className="block text-gray-700 dark:text-white hover:text-fuchsia-500 font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact Us
                        </Link>
                    </li>

                    {/* Mobile Services Dropdown */}
                    <li className="space-y-2">
                        <div className="font-medium text-gray-700 dark:text-white">Services</div>
                        <ul className="pl-4 space-y-2 border-l-2 border-gray-200">
                            <li>
                                <Link
                                    to="/products"
                                    className="block text-gray-600 dark:text-white hover:text-fuchsia-500  transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Materials
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/ordering"
                                    className="block text-gray-600 dark:text-white hover:text-fuchsia-500 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Ordering
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/tracking"
                                    className="block text-gray-600 dark:text-white hover:text-fuchsia-500 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Tracking
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="pt-4 flex flex-col space-y-3">
                        <Link
                            to="/signup"
                            className="border border-gray-300 dark:text-white rounded-full px-5 py-2 text-center text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Join Now
                        </Link>
                        <Link
                            to="/learn"
                            className="border border-fuchsia-500 bg-fuchsia-500 rounded-full px-5 py-2 text-center text-white font-medium hover:bg-fuchsia-600 hover:border-fuchsia-600 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Learn More
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Backdrop for dropdowns on desktop */}
            {dropdownOpen && (
                <div
                    className="hidden md:block fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                ></div>
            )}
        </header>
    );
}

export default Header;