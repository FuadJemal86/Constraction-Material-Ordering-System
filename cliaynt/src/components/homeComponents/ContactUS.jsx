import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Users, Shield, ArrowRight } from 'lucide-react';
import Footer from './Footer';
import Header from './Header';
import { BlinkBlur, FourSquare } from 'react-loading-indicators'

function ContactUs() {
    const [loading, setLoading] = useState(true)


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });


    setTimeout(() => {
        setLoading(false)
    }, 3000);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://formspree.io/f/mblyadwo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject || 'Contact Form Submission',
                    message: formData.message,
                    to: 'officialtechreach@gmail.com'
                }),
            });

            if (response.ok) {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                alert('There was an error sending your message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('There was an error sending your message. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className=''>
                <div className="absolute inset-0 flex justify-center items-center text-center bg-white/70 z-30">
                    <BlinkBlur color="#3134cc" size="medium" text="" textColor="" />
                </div>
            </div>
        )
    }

    const contactInfo = [
        {
            icon: <Mail className="w-8 h-8 text-blue-500" />,
            title: 'Email Us',
            description: 'Send us an email and we\'ll respond within 24 hours',
            contact: 'fuad.jemal.mail@gmail.com',
            link: 'mailto:fuad.jemal.mail@gmail.com'
        },
        {
            icon: <Phone className="w-8 h-8 text-green-500" />,
            title: 'Call Us',
            description: 'Speak directly with our support team',
            contact: '+251 902 920 302',
            link: 'tel:+251902920301'
        },
        {
            icon: <MapPin className="w-8 h-8 text-purple-500" />,
            title: 'Visit Us',
            description: '',
            contact: 'Jimma, Ethiopia',
            link: '#'
        },
        {
            icon: <MessageCircle className="w-8 h-8 text-orange-500" />,
            title: 'Live Chat',
            description: 'Get instant support through our chat system',
            contact: 'Available 6/2',
            link: 'https://t.me/Blazora_X'
        }

    ];

    const supportHours = [
        { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
        { day: 'Sunday', hours: 'Closed' }
    ];

    return (
        <div className="w-full overflow-x-hidden">
            <Header />
            {/* Hero Section */}
            <section className="relative w-full h-[80vh] min-h-[500px] bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-bl-[40px] rounded-br-[40px]">
                <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 rounded-bl-[40px] rounded-br-[40px]"></div>
                <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-blue-900/20 dark:to-gray-900/40"></div>
                <div className="relative z-10 flex items-center justify-center h-full px-4">
                    <div className="text-center text-white max-w-4xl transform transition-all duration-1000 ease-out">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-300 bg-gradient-to-r from-yellow-400 to-pink-400 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Contact
                            <span className="block bg-gradient-to-r text-white from-yellow-400 to-pink-400 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Jejan MarketPlace
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-200 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-500">
                            We're here to help you succeed. Get in touch with our team for support, partnerships, or any questions you may have.
                        </p>
                    </div>
                </div>

                {/* Animated background elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 dark:bg-cyan-400 rounded-full opacity-20 dark:opacity-30 animate-pulse"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400 dark:bg-purple-400 rounded-full opacity-20 dark:opacity-30 animate-bounce"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400 dark:bg-blue-400 rounded-full opacity-20 dark:opacity-30 animate-pulse"></div>
                <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-blue-400 dark:bg-pink-400 rounded-full opacity-10 dark:opacity-20 animate-ping"></div>
                <div className="absolute bottom-32 right-10 w-14 h-14 bg-purple-400 dark:bg-yellow-400 rounded-full opacity-15 dark:opacity-25 animate-pulse"></div>
            </section>

            {/* Contact Information Section */}
            <section className="py-20 px-4 md:px-10 lg:px-20 bg-white dark:bg-gray-800">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            Get In Touch
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                            Choose the best way to reach us. We're committed to providing excellent support and building lasting relationships.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="group p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                                <div className="mb-6 group-hover:scale-110 transition duration-300">
                                    {info.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                                    {info.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                    {info.description}
                                </p>
                                <a
                                    href={info.link}
                                    className="text-blue-600 dark:text-cyan-400 font-semibold hover:text-blue-700 dark:hover:text-cyan-300 transition duration-300 flex items-center"
                                >
                                    {info.contact}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Support Hours Section */}
            <section className="py-20 px-4 md:px-10 lg:px-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                Send us a Message
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-300"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-300"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-300"
                                        placeholder="+251 911 123 456"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-300"
                                        placeholder="What's this about?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-300 resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-cyan-600 dark:hover:to-purple-600 transform hover:scale-105 transition duration-300 shadow-lg dark:shadow-cyan-500/25 flex items-center justify-center"
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    Send Message
                                </button>
                            </div>
                        </div>

                        {/* Support Hours & Additional Info */}
                        <div className="space-y-8">
                            {/* Support Hours */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                                <div className="flex items-center mb-6">
                                    <Clock className="w-8 h-8 text-blue-500 mr-4" />
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Support Hours</h3>
                                </div>
                                <div className="space-y-4">
                                    {supportHours.map((schedule, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                {schedule.day}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {schedule.hours}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-700 p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                    Why Choose Us?
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Users className="w-6 h-6 text-blue-500 mr-3" />
                                        <span className="text-gray-700 dark:text-gray-300">6/2 Customer Support</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Shield className="w-6 h-6 text-green-500 mr-3" />
                                        <span className="text-gray-700 dark:text-gray-300">Secure & Trusted Platform</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MessageCircle className="w-6 h-6 text-purple-500 mr-3" />
                                        <span className="text-gray-700 dark:text-gray-300">Quick Response Time</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 md:px-10 lg:px-20 bg-white dark:bg-gray-800">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Find quick answers to common questions about our platform
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                question: "How do I register as a supplier?",
                                answer: "You can register as a supplier by clicking the 'Register' button and selecting 'Supplier Account'. Fill in your business details and wait for verification."
                            },
                            {
                                question: "What payment methods do you accept?",
                                answer: "We accept various payment methods including bank transfers, mobile money, and digital wallets for maximum convenience."
                            },
                            {
                                question: "How long does verification take?",
                                answer: "Supplier verification typically takes 1-3 business days. We'll notify you via email once your account is approved."
                            },
                            {
                                question: "Is there a fee to use the platform?",
                                answer: "Basic registration is free. We charge a small commission only on successful transactions to keep the platform running."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                    {faq.question}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 md:px-10 lg:px-20">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 p-12 md:p-16 rounded-3xl shadow-2xl dark:shadow-purple-900/50 text-center text-white relative overflow-hidden border dark:border-purple-500/20">
                    <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-cyan-900/20 dark:via-purple-900/30 dark:to-gray-900/40"></div>
                    <div className="relative z-10">
                        <MessageCircle className="w-16 h-16 mx-auto mb-6 text-pink-300 dark:text-cyan-300" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:bg-gradient-to-r dark:from-cyan-300 dark:to-purple-300 dark:bg-clip-text dark:text-transparent">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-8 text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
                            Join thousands of businesses already using Jejan Marketplace to grow their operations and build lasting partnerships.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-white text-blue-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-purple-500 dark:text-white font-bold rounded-full hover:bg-gray-100 dark:hover:from-cyan-600 dark:hover:to-purple-600 transform hover:scale-105 transition duration-300 shadow-lg dark:shadow-cyan-500/25">
                                Start Your Journey
                            </button>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-cyan-400 opacity-5 dark:opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white dark:bg-purple-400 opacity-5 dark:opacity-10 rounded-full transform -translate-x-24 translate-y-24"></div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default ContactUs;