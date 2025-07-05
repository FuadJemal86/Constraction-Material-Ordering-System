import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch } from "react-icons/fa";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { LightMode, DarkMode } from "@mui/icons-material";
import { Menu, X, User, LogIn, MessageCircle, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from "../CartContext";
import logo from '../../images/jejan.svg';
import bannerImage from '../../images/banner2 page2.jpg';
import ShoppingCart from './ShoppingCart';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import HeaderProfile from './HeaderProfile';
import useSocket from '../chatHook/useSocket';

function Header() {
    const navigate = useNavigate()
    // Core state management
    const { cart } = useCart();
    const [mobilePaymentsOpen, setMobilePaymentsOpen] = useState(false);
    const [mobileOrdersOpen, setMobileOrdersOpen] = useState(false);
    const [paymentStatus, setPaymentStatuses] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [count, setCount] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const [cartOpen, setCartOpen] = useState(false);
    const [islogin, setIsLogin] = useState(true);
    const [isBell, setIsBell] = useState(false);

    // Notification state
    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [userType, setUserType] = useState(null);

    // NEW: Message notification state
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [messageNotifications, setMessageNotifications] = useState([]);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);

    // Initialize socket connection
    const socket = useSocket(userId, userType);

    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Enhanced helper function to calculate unread count
    const calculateUnreadCount = useCallback((notificationsList) => {
        const count = notificationsList.filter(n => !n.isRead).length;
        console.log('Calculating unread count:', count, 'from', notificationsList.length, 'notifications');
        return count;
    }, []);

    // NEW: Calculate total unread count (notifications + messages)
    const calculateTotalUnreadCount = useCallback(() => {
        const notificationCount = calculateUnreadCount(notifications);
        const messageCount = unreadMessageCount;
        const total = notificationCount + messageCount;
        setTotalUnreadCount(total);
        console.log('Total unread count:', total, '(notifications:', notificationCount, '+ messages:', messageCount, ')');
        return total;
    }, [notifications, unreadMessageCount, calculateUnreadCount]);

    // Enhanced notification update function
    const updateNotificationCount = useCallback((notificationsList) => {
        const newCount = calculateUnreadCount(notificationsList);
        setUnreadNotificationCount(newCount);
        console.log('Updated notification count to:', newCount);
    }, [calculateUnreadCount]);

    // NEW: Update message count from socket
    const updateMessageCount = useCallback(() => {
        if (socket && socket.getUnreadCount) {
            const count = socket.getUnreadCount();
            setUnreadMessageCount(count);
            console.log('Updated message count to:', count);
        }
    }, [socket]);

    // NEW: Create message notification
    const createMessageNotification = useCallback((message) => {
        const messageNotification = {
            id: `message_${message.id}_${Date.now()}`,
            type: 'message',
            title: 'New Message',
            message: `${message.senderName}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
            isRead: false,
            createdAt: message.createdAt,
            data: {
                messageId: message.id,
                senderId: message.senderId,
                senderName: message.senderName,
                senderType: message.senderType,
                conversationId: message.senderId,
                conversationType: message.senderType
            }
        };

        setMessageNotifications(prev => [messageNotification, ...prev.slice(0, 19)]); // Keep only last 20
        setUnreadMessageCount(prev => prev + 1);

        // Show toast notification
        toast.success(`New message from ${message.senderName}`, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: darkMode ? '#374151' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
            },
            icon: '💬'
        });
    }, [darkMode]);

    // Get user info and initialize notifications
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const result = await api.get('/customer/verify-token');
                if (result.data.valid) {
                    setIsLogin(false);
                    setIsBell(true);
                    // Set user info for socket connection
                    setUserId(result.data.user?.id);
                    setUserType('customer');

                    // Fetch initial notifications
                    await fetchNotifications();
                } else {
                    console.log(result.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        };
        getUserInfo();
    }, []);

    // Enhanced fetch notifications function
    const fetchNotifications = async () => {
        try {
            const result = await api.get('/customer/get-notifications');
            if (result.data.status) {
                const fetchedNotifications = result.data.data || [];
                console.log('Fetched notifications:', fetchedNotifications);
                setNotifications(fetchedNotifications);
                updateNotificationCount(fetchedNotifications);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    // NEW: Enhanced socket event listeners for both notifications and messages
    useEffect(() => {
        if (socket.socket && socket.isConnected) {
            console.log('Setting up notification and message listeners');

            // Existing notification listeners
            const handleNewNotification = (notification) => {
                console.log('New notification received:', notification);

                const enhancedNotification = {
                    id: notification.id || `notification_${Date.now()}`,
                    type: notification.type || 'general',
                    title: notification.title || 'New Notification',
                    message: notification.message || 'You have a new notification',
                    isRead: notification.isRead || false,
                    createdAt: notification.createdAt || new Date().toISOString(),
                    data: notification.data || {}
                };

                setNotifications(prevNotifications => {
                    const updatedNotifications = [enhancedNotification, ...prevNotifications];
                    updateNotificationCount(updatedNotifications);
                    return updatedNotifications;
                });

                toast.success(enhancedNotification.message, {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        background: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                    }
                });
            };

            // NEW: Message listeners
            const handleNewMessage = (message) => {
                console.log('New message received in header:', message);

                // Only create notification if message is not from current user
                if (message.senderId !== userId) {
                    createMessageNotification(message);
                }
            };

            const handleConversationUpdate = () => {
                // Update message count when conversations change
                updateMessageCount();
            };

            // Listen for notification updates
            const handleNotificationUpdate = (updatedNotification) => {
                console.log('Notification update received:', updatedNotification);

                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(n =>
                        n.id === updatedNotification.id ? { ...n, ...updatedNotification } : n
                    );
                    updateNotificationCount(updatedNotifications);
                    return updatedNotifications;
                });
            };

            const handleBulkMarkAsRead = (notificationIds) => {
                console.log('Bulk mark as read:', notificationIds);

                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(n =>
                        notificationIds.includes(n.id) ? { ...n, isRead: true } : n
                    );
                    updateNotificationCount(updatedNotifications);
                    return updatedNotifications;
                });
            };

            const handleOrderStatusUpdate = (orderUpdate) => {
                console.log('Order status update received:', orderUpdate);

                const notification = {
                    id: `order_${orderUpdate.orderId}_${Date.now()}`,
                    type: 'order_update',
                    title: 'Order Status Updated',
                    message: `Your order #${orderUpdate.orderId} is now ${orderUpdate.status}`,
                    isRead: false,
                    createdAt: new Date().toISOString(),
                    data: orderUpdate
                };

                setNotifications(prevNotifications => {
                    const updatedNotifications = [notification, ...prevNotifications];
                    updateNotificationCount(updatedNotifications);
                    return updatedNotifications;
                });

                toast.success(notification.message, {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        background: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                    }
                });
            };

            const handlePaymentStatusUpdate = (paymentUpdate) => {
                console.log('Payment status update received:', paymentUpdate);

                const notification = {
                    id: `payment_${paymentUpdate.orderId}_${Date.now()}`,
                    type: 'payment_update',
                    title: 'Payment Status Updated',
                    message: `Payment for order #${paymentUpdate.orderId} is ${paymentUpdate.status}`,
                    isRead: false,
                    createdAt: new Date().toISOString(),
                    data: paymentUpdate
                };

                setNotifications(prevNotifications => {
                    const updatedNotifications = [notification, ...prevNotifications];
                    updateNotificationCount(updatedNotifications);
                    return updatedNotifications;
                });

                toast.success(notification.message, {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        background: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                    }
                });
            };

            // Register all event listeners
            socket.socket.on('newNotification', handleNewNotification);
            socket.socket.on('notificationUpdate', handleNotificationUpdate);
            socket.socket.on('notificationsMarkedAsRead', handleBulkMarkAsRead);
            socket.socket.on('orderStatusUpdate', handleOrderStatusUpdate);
            socket.socket.on('paymentStatusUpdate', handlePaymentStatusUpdate);

            // NEW: Message event listeners
            socket.socket.on('newMessage', handleNewMessage);
            socket.socket.on('conversationsList', handleConversationUpdate);

            return () => {
                console.log('Cleaning up notification and message listeners');
                socket.socket.off('newNotification', handleNewNotification);
                socket.socket.off('notificationUpdate', handleNotificationUpdate);
                socket.socket.off('notificationsMarkedAsRead', handleBulkMarkAsRead);
                socket.socket.off('orderStatusUpdate', handleOrderStatusUpdate);
                socket.socket.off('paymentStatusUpdate', handlePaymentStatusUpdate);
                socket.socket.off('newMessage', handleNewMessage);
                socket.socket.off('conversationsList', handleConversationUpdate);
            };
        }
    }, [socket.socket, socket.isConnected, updateNotificationCount, darkMode, userId, createMessageNotification, updateMessageCount]);

    // NEW: Update total count when either notifications or messages change
    useEffect(() => {
        calculateTotalUnreadCount();
    }, [calculateTotalUnreadCount]);

    // NEW: Initialize message count when socket connects
    useEffect(() => {
        if (socket.isConnected) {
            updateMessageCount();
        }
    }, [socket.isConnected, updateMessageCount]);

    // Enhanced mark notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            // Check if the API endpoint exists before making the call
            const response = await api.put(`/customer/notifications/${notificationId}/read`);

            if (response.data.status) {
                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(n =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    );
                    updateNotificationCount(updatedNotifications);
                    return updatedNotifications;
                });
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);

            // If the API endpoint doesn't exist, just update the state locally
            if (err.response?.status === 404) {
                console.log('API endpoint not found, updating locally only');
                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(n =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    );
                    updateNotificationCount(updatedNotifications);
                    return updatedNotifications;
                });
            } else {
                toast.error('Failed to mark notification as read');
            }
        }
    };

    // NEW: Mark message notification as read
    const markMessageNotificationAsRead = (messageNotificationId) => {
        setMessageNotifications(prev =>
            prev.map(n => n.id === messageNotificationId ? { ...n, isRead: true } : n)
        );
        setUnreadMessageCount(prev => Math.max(0, prev - 1));
    };

    // FIXED: Enhanced mark all notifications as read with proper error handling
    const markAllNotificationsAsRead = async () => {
        try {
            // Try to call the API endpoint
            const response = await api.put('/customer/notifications/mark-all-read');

            if (response.data.status) {
                // API call successful
                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(n => ({ ...n, isRead: true }));
                    setUnreadNotificationCount(0);
                    return updatedNotifications;
                });

                // Also mark message notifications as read
                setMessageNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadMessageCount(0);

                toast.success('All notifications marked as read');
            }
        } catch (err) {
            console.error('Error marking all notifications as read:', err);

            // If the API endpoint doesn't exist (404), just update the state locally
            if (err.response?.status === 404) {
                console.log('Mark all notifications API endpoint not found, updating locally only');

                // Update notifications locally
                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(n => ({ ...n, isRead: true }));
                    setUnreadNotificationCount(0);
                    return updatedNotifications;
                });

                // Also mark message notifications as read
                setMessageNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadMessageCount(0);

                toast.success('All notifications marked as read');
            } else {
                // Other errors
                toast.error('Failed to mark all notifications as read');
            }
        }
    };

    // NEW: Get combined notifications (regular + message notifications)
    const getCombinedNotifications = useCallback(() => {
        const combined = [...notifications, ...messageNotifications];
        return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [notifications, messageNotifications]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    useEffect(() => {
        document.body.style.overflow = cartOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [cartOpen]);

    useEffect(() => {
        const fetchTransitionId = async () => {
            try {
                const result = await api.get('/customer/get-transitionId');

                if (result.data.status) {
                    setCount(result.data.count);
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                // toast.error(err.response?.data?.message || 'Failed to fetch transition ID');
            }
        };

        fetchTransitionId();
    }, []);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const result = await api.get('/customer/get-payment-status');

                if (result.data.status) {
                    setPaymentStatuses(result.data.paymentStatuses);
                    setOrderStatus(result.data.orders);
                } else {
                    toast.error(result.data.message);
                }
            } catch (err) {
                console.error('Error fetching payment statuses:', err);
                // toast.error(err.response?.data?.message || 'Failed to fetch payment statuses');
            }
        };

        fetchStatus();
    }, []);



    // to navigate in to chat

    const handelNavigate = () => {
        navigate('/chat')
    }

    return (
        <div>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#ffffff' : '#000000',
                        border: darkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
                    },
                }}
            />
            <header className="relative">
                <div className='flex items-center justify-between md:p-2 p-1 fixed right-0 left-0 top-0 bg-white dark:bg-gray-900 z-20 shadow-md'>

                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img className='md:w-32 md:h-14 m-1 w-28 h-12' src={logo} alt="Logo" />
                        </Link>
                    </div>

                    <div className='hidden md:flex justify-center w-full'>
                        <nav>
                            <ul className='flex gap-6 font-semibold'>
                                <li><Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link></li>
                                <li><Link className="hover:text-yellow-500 transition-colors">Category</Link></li>
                                <li><Link to="/about-us" className="hover:text-yellow-500 transition-colors">About Us</Link></li>
                                <li><Link to="https://officaltechreach.vercel.app/" className="hover:text-yellow-500 transition-colors">Contact</Link></li>
                            </ul>
                        </nav>
                    </div>



                    {/* Header Icons */}
                    <div className='flex gap-2 md:gap-5 items-center'>
                        <HeaderProfile />

                        {/* Login Button */}
                        {islogin && (
                            <Link
                                to="/customer-sign-in"
                                className="group relative flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-yellow-500 transition-all duration-300 font-medium"
                            >
                                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <span className="relative z-10">
                                    Login
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
                                </span>
                                <LogIn className="w-4 h-4 relative z-10 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </Link>
                        )}

                        {/* Cart Button */}
                        <button
                            className="relative hidden md:block"
                            onClick={() => setCartOpen(true)}
                        >
                            <div className="w-10 h-10 flex items-center justify-center">
                                <ShoppingCartOutlinedIcon className="text-2xl" />
                            </div>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        {/* NEW: Enhanced Notification Icon with Combined Count */}
                        {isBell && (
                            <div className="relative group">
                                <button
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative"
                                    onClick={() => markAllNotificationsAsRead()}
                                >
                                    <div className="relative">
                                        <MessageCircle onClick={handelNavigate} className="w-6 h-6" />
                                        {unreadMessageCount > 0 && (
                                            <MessageCircle className="w-3 h-3 absolute -top-1 -right-1 text-blue-500" />
                                        )}
                                    </div>
                                    {/* NEW: Combined notification badge */}
                                    {totalUnreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse min-w-[20px] text-center shadow-lg">
                                            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* NEW: Enhanced Notification Dropdown with Message Notifications */}
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-30 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 max-h-96 overflow-y-auto border dark:border-gray-700">
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-lg">
                                                Notifications
                                                {totalUnreadCount > 0 && (
                                                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        {totalUnreadCount}
                                                    </span>
                                                )}
                                            </h3>
                                            {totalUnreadCount > 0 && (
                                                <button
                                                    onClick={markAllNotificationsAsRead}
                                                    className="text-yellow-500 hover:text-yellow-600 hover:underline text-sm transition-colors"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>

                                        {/* NEW: Notification Type Filters */}
                                        <div className="flex gap-2 mb-4">
                                            <div className="flex items-center gap-1 text-xs">
                                                <Bell className="w-3 h-3" />
                                                <span>{unreadNotificationCount} system</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <MessageCircle className="w-3 h-3" />
                                                <span>{unreadMessageCount} messages</span>
                                            </div>
                                        </div>

                                        {getCombinedNotifications().length === 0 ? (
                                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>No notifications yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {getCombinedNotifications().slice(0, 5).map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${notification.isRead
                                                            ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                            : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                                                            }`}
                                                        onClick={() => {
                                                            if (!notification.isRead) {
                                                                if (notification.type === 'message') {
                                                                    markMessageNotificationAsRead(notification.id);
                                                                } else {
                                                                    markNotificationAsRead(notification.id);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    {notification.type === 'message' ? (
                                                                        <MessageCircle className="w-4 h-4 text-blue-500" />
                                                                    ) : (
                                                                        <Bell className="w-4 h-4 text-gray-500" />
                                                                    )}
                                                                    <div className="font-medium text-sm">
                                                                        {notification.title || 'Notification'}
                                                                    </div>
                                                                </div>
                                                                <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                                                    {notification.message}
                                                                </div>
                                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                                    {new Date(notification.createdAt).toLocaleString()}
                                                                </div>
                                                            </div>
                                                            {!notification.isRead && (
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                {getCombinedNotifications().length > 5 && (
                                                    <Link
                                                        to="/chat"
                                                        className="block text-center text-yellow-500 hover:text-yellow-600 hover:underline text-sm py-3 transition-colors"
                                                    >
                                                        View all {getCombinedNotifications().length} notifications
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="hidden md:flex p-1 md:p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded  items-center transition-colors"
                        >
                            {darkMode ? <LightMode className="text-xl md:text-2xl" /> : <DarkMode className="text-xl md:text-2xl" />}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className='md:hidden p-1'
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto">
                        {/* Header with close button */}
                        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold">Menu</h2>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Close menu"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="container mx-auto px-4 py-6 pt-2">
                            <nav className="mb-8">
                                <ul className="space-y-2">
                                    <li className="border-b border-gray-200 dark:border-gray-700">
                                        <Link
                                            to="/"
                                            className="block py-3 text-lg font-medium hover:text-yellow-500 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li className="border-b border-gray-200 dark:border-gray-700">
                                        <Link
                                            to="/category"
                                            className="block py-3 text-lg font-medium hover:text-yellow-500 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Category
                                        </Link>
                                    </li>
                                    <li className="border-b border-gray-200 dark:border-gray-700">
                                        <Link
                                            to="/about-us"
                                            className="block py-3 text-lg font-medium hover:text-yellow-500 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            About Us
                                        </Link>
                                    </li>
                                    <li className="border-b border-gray-200 dark:border-gray-700">
                                        <Link
                                            to="/contact"
                                            className="block py-3 text-lg font-medium hover:text-yellow-500 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Contact
                                        </Link>
                                    </li>

                                    {islogin && (
                                        <li className="border-b border-gray-200 dark:border-gray-700">
                                            <Link
                                                to="/customer-sign-in"
                                                className="flex items-center gap-3 py-3 text-lg font-medium hover:text-yellow-500 transition-colors group"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                <span className="relative">
                                                    Login
                                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
                                                </span>
                                                <LogIn className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </nav>

                            {/* Theme Toggle */}
                            <div className="flex items-center justify-between p-4 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <span className="font-medium">Theme</span>
                                <button
                                    onClick={() => {
                                        setDarkMode(!darkMode);
                                    }}
                                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                                >
                                    {darkMode ? (
                                        <LightMode className="text-xl" />
                                    ) : (
                                        <DarkMode className="text-xl" />
                                    )}
                                </button>
                            </div>

                            {/* Mobile Actions */}
                            <div className="space-y-4">
                                {/* Notifications */}
                                {isBell && (
                                    <div
                                        className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            // Add your notification handler here
                                        }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <NotificationsNoneIcon className="text-2xl" />
                                            <span className="font-medium">Notifications</span>
                                        </div>
                                        {unreadNotificationCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Cart */}
                                <div
                                    className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setCartOpen(true);
                                    }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <ShoppingCartOutlinedIcon className="text-2xl" />
                                        <span className="font-medium">Cart</span>
                                    </div>
                                    {cartItemCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shopping Cart Modal */}
                {cartOpen && <ShoppingCart onClose={() => setCartOpen(false)} />}
            </header>

            {/* Banner Section */}
            <section className="relative w-full h-[70vh] min-h-[500px] bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-bl-[40px] rounded-br-[40px] bg-white">
                <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-60"></div>
                <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-blue-900/20 dark:to-gray-900/40"></div>
                <div className="relative z-10 flex items-center justify-center h-full px-4">
                    <div className="text-center text-white max-w-4xl">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Connect with
                            <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Trusted Suppliers
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
                            Bridge the gap between customers and suppliers. Find quality products,
                            build lasting partnerships, and grow your business together.
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
        </div>
    );
}

export default Header;