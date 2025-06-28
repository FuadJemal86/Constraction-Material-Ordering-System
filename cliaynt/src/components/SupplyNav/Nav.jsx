import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../images/jejan.svg';
import toast from 'react-hot-toast';
import {
    Menu, X, ChevronLeft, ChevronRight, Eye, Package, Box,
    CreditCard, MessageCircle, MoreVertical, Bell, Search, User, PlayCircle, StopCircle, Globe, Trash2,
    Settings, CheckCircle, AlertCircle, TrendingUp
} from "lucide-react";
import api from '../../api';
import useSocket from '../chatHook/useSocket';
import supplierValidation from '../../hookes/supplierValidation';

function Nav() {
    supplierValidation()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isOnline, setOnline] = useState(true);
    const [isVerifiy, setVerifay] = useState();
    const [supplierImage, setSupplierImage] = useState({});
    const [supplierId, setSupplierId] = useState(null);
    const location = useLocation();

    // Profile completion state
    const [profileCompletion, setProfileCompletion] = useState(60);
    const [showProfileProgress, setShowProfileProgress] = useState(true);

    // Enhanced message state management similar to Header.jsx
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [messageNotifications, setMessageNotifications] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);

    // Initialize socket for supplier with enhanced functionality
    const socket = useSocket(supplierId, 'supplier');

    // Calculate profile completion percentage
    const calculateProfileCompletion = useCallback(() => {
        let completion = 60; // Base completion for signup

        if (isVerifiy === true) {
            completion = 100; // Full completion when verified
        } else if (isVerifiy === false) {
            completion = 60; // Partial completion when not verified
        }

        setProfileCompletion(completion);

        // Hide progress bar when 100% complete
        if (completion === 100) {
            setTimeout(() => setShowProfileProgress(false), 3000);
        } else {
            setShowProfileProgress(true);
        }
    }, [isVerifiy]);

    // Enhanced helper function to calculate unread count
    const calculateUnreadCount = useCallback((notificationsList) => {
        const count = notificationsList.filter(n => !n.isRead).length;
        console.log('Calculating unread count:', count, 'from', notificationsList.length, 'notifications');
        return count;
    }, []);

    // Calculate total unread count (notifications + messages)
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

    // Update message count from socket
    const updateMessageCount = useCallback(() => {
        if (socket && socket.getUnreadCount) {
            const count = socket.getUnreadCount();
            setUnreadMessageCount(count);
            console.log('Updated message count to:', count);
        }
    }, [socket]);

    // Create message notification
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
            icon: '💬'
        });
    }, []);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen);
    };

    const stopSupplier = async () => {
        try {
            const result = await api.put('/supplier/offline')
            if (result.data.status) {
                setOnline(result.data.onlineStatus)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const startSupplier = async () => {
        try {
            const result = await api.put('/supplier/online');
            if (result.data.status) {
                setOnline(result.data.onlineStatus);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            startSupplier();
        } else {
            stopSupplier();
        }
    };

    // Enhanced fetch notifications function
    const fetchNotifications = async () => {
        try {
            const result = await api.get('/supplier/get-notifications');
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

    // Enhanced mark notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            const response = await api.put(`/supplier/notifications/${notificationId}/read`);

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

    // Mark message notification as read
    const markMessageNotificationAsRead = (messageNotificationId) => {
        setMessageNotifications(prev =>
            prev.map(n => n.id === messageNotificationId ? { ...n, isRead: true } : n)
        );
        setUnreadMessageCount(prev => Math.max(0, prev - 1));
    };

    // Enhanced mark all notifications as read
    const markAllNotificationsAsRead = async () => {
        try {
            const response = await api.put('/supplier/notifications/mark-all-read');

            if (response.data.status) {
                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(n => ({ ...n, isRead: true }));
                    setUnreadNotificationCount(0);
                    return updatedNotifications;
                });

                setMessageNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadMessageCount(0);

                toast.success('All notifications marked as read');
            }
        } catch (err) {
            console.error('Error marking all notifications as read:', err);

            if (err.response?.status === 404) {
                console.log('Mark all notifications API endpoint not found, updating locally only');

                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(n => ({ ...n, isRead: true }));
                    setUnreadNotificationCount(0);
                    return updatedNotifications;
                });

                setMessageNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadMessageCount(0);

                toast.success('All notifications marked as read');
            } else {
                toast.error('Failed to mark all notifications as read');
            }
        }
    };

    // Get combined notifications (regular + message notifications)
    const getCombinedNotifications = useCallback(() => {
        const combined = [...notifications, ...messageNotifications];
        return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [notifications, messageNotifications]);

    useEffect(() => {
        startSupplier();

        // Add visibility change event listener
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const pingInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                api.put('/supplier/online').catch(err => console.log(err));
            }
        }, 30000);

        return () => {
            stopSupplier();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(pingInterval);
        };
    }, []);

    useEffect(() => {
        const chekVerify = async () => {
            try {
                const result = await api.get('/supplier/is-verify')

                if (result.data.status) {
                    setVerifay(result.data.supplierVerifiy)
                    setOnline(result.data.chekOnline)
                    setSupplierId(result.data.supplierId || result.data.id);

                    // Fetch initial notifications
                    await fetchNotifications();
                } else {
                    toast.error(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        chekVerify()
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await api.get('/supplier/supplier-profile')
                if (result.data.status) {
                    setSupplierImage(result.data.supplierImage)
                    if (!supplierId && result.data.supplierId) {
                        setSupplierId(result.data.supplierId);
                    }
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchProfile()
    }, [supplierId])

    // Calculate profile completion when verification status changes
    useEffect(() => {
        calculateProfileCompletion();
    }, [calculateProfileCompletion]);

    // Enhanced socket event listeners for both notifications and messages
    useEffect(() => {
        if (socket.socket && socket.isConnected) {
            console.log('Setting up notification and message listeners for supplier');

            // Notification listeners
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
                    position: 'top-right'
                });
            };

            // Message listeners
            const handleNewMessage = (message) => {
                console.log('New message received in supplier nav:', message);

                // Only create notification if message is not from current supplier
                if (message.senderId !== supplierId) {
                    createMessageNotification(message);
                }
            };

            const handleConversationUpdate = () => {
                updateMessageCount();
            };

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

            // Register event listeners
            socket.socket.on('newNotification', handleNewNotification);
            socket.socket.on('notificationUpdate', handleNotificationUpdate);
            socket.socket.on('notificationsMarkedAsRead', handleBulkMarkAsRead);
            socket.socket.on('newMessage', handleNewMessage);
            socket.socket.on('conversationsList', handleConversationUpdate);

            return () => {
                console.log('Cleaning up notification and message listeners');
                socket.socket.off('newNotification', handleNewNotification);
                socket.socket.off('notificationUpdate', handleNotificationUpdate);
                socket.socket.off('notificationsMarkedAsRead', handleBulkMarkAsRead);
                socket.socket.off('newMessage', handleNewMessage);
                socket.socket.off('conversationsList', handleConversationUpdate);
            };
        }
    }, [socket.socket, socket.isConnected, updateNotificationCount, supplierId, createMessageNotification, updateMessageCount]);

    // Update total count when either notifications or messages change
    useEffect(() => {
        calculateTotalUnreadCount();
    }, [calculateTotalUnreadCount]);

    // Initialize message count when socket connects
    useEffect(() => {
        if (socket.isConnected) {
            updateMessageCount();
        }
    }, [socket.isConnected, updateMessageCount]);

    const menuItems = useMemo(() => [
        { icon: <Eye size={20} />, title: 'Overview', path: '' },
        { icon: <Package size={20} />, title: 'Orders', path: '/supplier-page/order' },
        {
            icon: <CreditCard size={20} />, title: 'Payments', path: '/supplier-page/payment',
            Chevron: <ChevronRight size={20} />,
            subMenu: [
                { icone: <Globe />, title: 'Completed', path: '/supplier-page/done-payment' },
            ]
        },
        { icon: <Box size={20} />, title: 'Products', path: '/supplier-page/product' },
        isOnline
            ? { icon: <StopCircle size={20} />, title: 'Stop', onClick: stopSupplier }
            : { icon: <PlayCircle size={20} />, title: 'Start', onClick: startSupplier },
    ], [isOnline]);

    const [openSubMenus, setOpenSubMenus] = useState({});

    const toggleSubMenu = (title) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const handleNavigate = () => {
        navigate('/chat')
    }

    const handleProfileProgressClick = () => {
        if (profileCompletion < 100) {
            navigate('/supplier-verification');
        }
    };


    const [isReviw, setReviw] = useState(null)

    useEffect(() => {
        const chekIsReviw = async () => {
            try {
                const result = await api.get('/supplier/chek-reviw')

                if (result.data.status) {
                    setReviw(result.data.reviw)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        chekIsReviw()

    }, [])

    return (
        <div className="flex flex-col h-screen lg:flex-row min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static top-0 left-0 z-50
                h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out
                ${collapsed ? 'w-24' : 'w-64'}
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo section */}
                <div className="p-4 flex flex-row items-center">
                    <div className="flex items-center gap-3">
                        {!collapsed ? (
                            <div className="relative mb-1">
                                <img
                                    className="relative w-40 h-16"
                                    src={logo}
                                    alt="ConstructEasy Logo"
                                />
                            </div>
                        ) : (
                            <div className="bg-blue-500 text-white rounded-lg h-10 w-10 flex items-center justify-center">
                                <span className="font-bold text-xl">J</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-400 hover:text-white hidden lg:block ml-4"
                    >
                        <ChevronLeft size={20} className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Profile Completion Progress - Only show when not collapsed and visible */}

                {
                    !isReviw ? (
                        <div>
                            {!collapsed && !isReviw && showProfileProgress && profileCompletion < 100 && (
                                <div className="px-4 pb-4">
                                    <div
                                        className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors"
                                        onClick={handleProfileProgressClick}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={16} className="text-blue-400" />
                                                <span className="text-sm font-semibold">Profile Setup</span>
                                            </div>
                                            <span className="text-sm font-bold text-blue-400">{profileCompletion}%</span>
                                        </div>

                                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${profileCompletion}%` }}
                                            ></div>
                                        </div>

                                        <div className="text-xs text-gray-400">
                                            {profileCompletion === 60 ? 'Complete verification to unlock all features' : 'Almost there!'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    ) : (
                        <div className="px-4 pb-4">
                            <div
                                className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} className="text-blue-400" />
                                        <span className="text-sm font-semibold">Profile under review</span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-400">{profileCompletion}%</span>
                                </div>

                                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${profileCompletion}%` }}
                                    ></div>
                                </div>

                                <div className="text-xs text-gray-400">
                                    {profileCompletion === 60 ? 'Profile under review. Features will unlock within 24 hours.' : 'Almost there!'}
                                </div>
                            </div>
                        </div>

                    )
                }

                {/* Congratulations message for 100% completion */}
                {!collapsed && profileCompletion === 100 && showProfileProgress && (
                    <div className="px-4 pb-4">
                        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-3 text-center">
                            <CheckCircle size={24} className="text-white mx-auto mb-2" />
                            <div className="text-sm font-semibold text-white">Profile Complete!</div>
                            <div className="text-xs text-green-100">You're all set to go</div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="mt-6">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            const isSubMenuOpen = openSubMenus[item.title];

                            return (
                                <li key={item.path || index} className="w-full">
                                    {item.onClick ? (
                                        <button
                                            onClick={item.onClick}
                                            className={`
                                                w-full flex items-center justify-between py-3 px-3 rounded-lg transition-colors
                                                text-gray-300 hover:bg-gray-800 hover:text-white
                                            `}
                                        >
                                            <div className="flex items-center">
                                                <span className="inline-flex">{item.icon}</span>
                                                {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                                            </div>
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className={`
                                                flex items-center justify-between py-3 px-3 rounded-lg transition-colors
                                                ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                                            `}
                                        >
                                            <div className="flex items-center">
                                                <span className="inline-flex">{item.icon}</span>
                                                {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                                            </div>

                                            {/* Arrow Icon */}
                                            {!collapsed && item.Chevron && (
                                                <span
                                                    className={`ml-auto transform transition-transform ${isSubMenuOpen ? 'rotate-90' : ''}`}
                                                    onClick={item.subMenu ? (e) => {
                                                        e.preventDefault();
                                                        toggleSubMenu(item.title);
                                                    } : undefined}
                                                >
                                                    {item.Chevron}
                                                </span>
                                            )}
                                        </Link>
                                    )}

                                    {/* If item has subMenu */}
                                    {item.subMenu && !collapsed && (
                                        <ul className={`ml-8 mt-1 space-y-1 ${!isSubMenuOpen ? 'hidden' : ''}`}>
                                            {item.subMenu.map((subItem) => {
                                                const isSubActive = location.pathname === subItem.path;
                                                return (
                                                    <li key={subItem.path}>
                                                        <Link
                                                            to={subItem.path}
                                                            className={`
                                                                block py-2 px-3 rounded-lg text-sm transition-colors
                                                                ${isSubActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                                                            `}
                                                        >
                                                            <div className='flex items-center'>
                                                                <span className="inline-flex mr-2 h-5 w-5 items-center">{subItem.icone}</span>
                                                                <span>{subItem.title}</span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <div className='flex-1 flex flex-col'>
                {/* Header */}
                <header className="bg-white shadow-sm z-10 sticky top-0">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center">
                            <button
                                onClick={toggleMobileSidebar}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none lg:hidden"
                            >
                                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <div className="ml-2 lg:ml-6 relative text-gray-500 focus-within:text-gray-900 hidden md:block">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* Profile Completion Progress in Header (Mobile) */}
                            {showProfileProgress && profileCompletion < 100 && (
                                <div className="flex items-center space-x-2 lg:hidden">
                                    <button
                                        onClick={handleProfileProgressClick}
                                        className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                                    >
                                        <TrendingUp size={14} />
                                        <span className="text-sm font-medium">{profileCompletion}%</span>
                                    </button>
                                </div>
                            )}

                            {/* Status indicator */}
                            <div className="px-2 py-1 rounded-full flex items-center space-x-1">
                                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                            </div>

                            {/* Verification Status / Button */}
                            {!isVerifiy ? (
                                <Link
                                    className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-full transition-colors"
                                >
                                    <AlertCircle size={14} />
                                    <span className="text-sm font-medium">Verify Account</span>
                                </Link>
                            ) : (
                                <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                    <CheckCircle size={14} />
                                    <span className="text-sm font-medium">Verified</span>
                                </div>
                            )}

                            {/* Enhanced Notification Bell Icon with Proper Count Badge */}
                            <div className="relative group">
                                <button
                                    className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors relative"
                                    onClick={() => markAllNotificationsAsRead()}
                                >
                                    <MessageCircle size={18} onClick={handleNavigate} />
                                    {/* Show notification count badge only when there are unread notifications */}
                                    {unreadNotificationCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse min-w-[20px] text-center shadow-lg">
                                            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                                        </span>
                                    )}
                                </button>

                                {/* Enhanced Notification Dropdown */}
                                <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl z-30 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 max-h-96 overflow-y-auto border rounded-lg">
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
                                                    className="text-blue-500 hover:text-blue-600 hover:underline text-sm transition-colors"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>

                                        {/* Notification Type Filters */}
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
                                            <div className="text-center text-gray-500 py-8">
                                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>No notifications yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {getCombinedNotifications().slice(0, 5).map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${notification.isRead
                                                            ? 'bg-gray-50 hover:bg-gray-100'
                                                            : 'bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100'
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
                                                                <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                                    {notification.message}
                                                                </div>
                                                                <div className="text-xs text-gray-400">
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
                                                        to="/notifications"
                                                        className="block text-center text-blue-500 hover:text-blue-600 hover:underline text-sm py-3 transition-colors"
                                                    >
                                                        View all {getCombinedNotifications().length} notifications
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <Link to={'/setting'}>
                                    <Settings size={20} />
                                </Link>
                            </button>
                            <div className="ml-2 hidden sm:block">
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    {supplierImage?.image ? (
                                        <div className="h-8 w-8 rounded-full  flex items-center justify-center text-white">
                                            <span className="font-medium text-sm "><img className='rounded-full h-8 w-8' src={`http://localhost:3032/images/${supplierImage.image}`} alt="" srcSet="" /></span>
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                            <span className="font-medium text-sm">S</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Nav;