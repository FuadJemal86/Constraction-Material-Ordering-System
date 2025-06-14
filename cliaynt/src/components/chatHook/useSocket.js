import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import api from '../../api';
// Assuming you have these utilities in your project
// import { api } from '../utils/api'; // or wherever your api utility is located
// import { toast } from 'react-toastify'; // or your toast notification system

const useSocket = (userId, userType) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;

    // Fetch suppliers from API - Updated to match your API structure
    const fetchSuppliers = useCallback(async () => {
        if (userType !== 'customer') return;

        setIsLoading(true);
        try {
            const response = await api.get('/customer/get-supplier');

            const result = response.data;

            if (result.status && result.supplier) {
                const formattedSuppliers = result.supplier
                    .filter(supplier => supplier.isApproved && supplier.isVerify)
                    .map(supplier => ({
                        id: supplier.id,
                        name: supplier.companyName || `Supplier ${supplier.id}`,
                        companyName: supplier.companyName,
                        type: 'supplier',
                        image: supplier.image || supplier.avatar || null,
                        address: supplier.address,
                        isApproved: supplier.isApproved,
                        isVerify: supplier.isVerify,
                        lastMessage: '',
                        lastMessageTime: new Date().toISOString(),
                        unreadCount: 0
                    }));

                setSuppliers(formattedSuppliers);
                setError(null);
            } else {
                throw new Error(result.message || 'Failed to load suppliers');
            }
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            const message = error.response?.data?.message || error.message || 'Failed to load suppliers';
            setError(message);
            // toast.error(message); // uncomment if you're using toast
        } finally {
            setIsLoading(false);
        }
    }, [userType]);

    // Alternative version using your api utility (if you prefer this approach)
    /*
    const fetchSuppliers = useCallback(async () => {
        if (userType !== 'customer') return;

        setIsLoading(true);
        try {
            const result = await api.get('/customer/get-supplier');
            if (result.data.status) {
                const formattedSuppliers = result.data.supplier
                    .filter(supplier => supplier.isApproved && supplier.isVerify)
                    .map(supplier => ({
                        id: supplier.id,
                        name: supplier.companyName || `Supplier ${supplier.id}`,
                        companyName: supplier.companyName,
                        type: 'supplier',
                        image: supplier.image || supplier.avatar || null,
                        address: supplier.address,
                        isApproved: supplier.isApproved,
                        isVerify: supplier.isVerify,
                        lastMessage: '',
                        lastMessageTime: new Date().toISOString(),
                        unreadCount: 0
                    }));
                
                setSuppliers(formattedSuppliers);
                setError(null);
            } else {
                toast.error(result.data.message);
                setError(result.data.message);
            }
        } catch (err) {
            console.log(err);
            const errorMessage = err.response?.data?.message || 'Error fetching suppliers';
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [userType]);
    */

    // Connect to socket
    const connect = useCallback(() => {
        if (!userId || !userType) return;

        setConnectionStatus('connecting');

        const newSocket = io('http://localhost:3032', {
            transports: ['websocket'],
            withCredentials: true,
            timeout: 10000,
            forceNew: true
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Connection events
        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            setConnectionStatus('connected');
            reconnectAttemptsRef.current = 0;
            newSocket.emit('join', { userId, userType });
        });

        newSocket.on('connected', (data) => {
            console.log('Successfully joined chat:', data);
            setIsConnected(true);
            setCurrentUser(data.user);
            setError(null);

            // Fetch suppliers for customers
            if (userType === 'customer') {
                fetchSuppliers();
            }
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Disconnected from socket server:', reason);
            setIsConnected(false);
            setConnectionStatus('disconnected');

            if (reason === 'io server disconnect') {
                // Server disconnected, manual reconnect needed
                attemptReconnect();
            }
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            setConnectionStatus('error');
            attemptReconnect();
        });

        // Message events
        newSocket.on('newMessage', (message) => {
            console.log('New message received:', message);
            setMessages(prev => [...prev, { ...message, isOwn: false }]);

            // Update conversation with new message
            updateConversationWithMessage(message);
        });

        newSocket.on('messageReceived', (message) => {
            console.log('Message sent successfully:', message);
            setMessages(prev => {
                return prev.map(msg => {
                    if (msg.tempId && msg.tempId === message.tempId) {
                        return { ...message, isOwn: true, status: 'sent' };
                    }
                    return msg;
                });
            });
        });

        newSocket.on('messageFailed', (data) => {
            console.error('Message failed:', data);
            setMessages(prev => {
                return prev.map(msg => {
                    if (msg.tempId && msg.tempId === data.tempId) {
                        return { ...msg, status: 'failed' };
                    }
                    return msg;
                });
            });
        });

        newSocket.on('conversationHistory', (data) => {
            console.log('Conversation history:', data);
            const formattedMessages = data.messages.map(msg => ({
                ...msg,
                isOwn: msg.senderId === parseInt(userId)
            }));
            setMessages(formattedMessages);
            setIsLoading(false);
        });

        newSocket.on('conversationsList', (conversationsList) => {
            console.log('Conversations list:', conversationsList);
            setConversations(conversationsList);
        });

        // Online status events
        newSocket.on('userOnline', (user) => {
            console.log('User came online:', user);
            setOnlineUsers(prev => {
                const filtered = prev.filter(u => !(u.id === user.id && u.type === user.type));
                return [...filtered, user];
            });
        });

        newSocket.on('userOffline', (user) => {
            console.log('User went offline:', user);
            setOnlineUsers(prev => prev.filter(u => !(u.id === user.id && u.type === user.type)));
        });

        newSocket.on('onlineUsers', (users) => {
            console.log('Online users:', users);
            setOnlineUsers(users);
        });

        // Typing events
        newSocket.on('userTyping', (data) => {
            setTypingUsers(prev => {
                const filtered = prev.filter(u => !(u.userId === data.userId && u.userType === data.userType));
                return [...filtered, { ...data, id: data.conversationId, type: data.conversationType }];
            });
        });

        newSocket.on('userStoppedTyping', (data) => {
            setTypingUsers(prev => prev.filter(u => !(u.userId === data.userId && u.userType === data.userType)));
        });

        // Error handling
        newSocket.on('error', (errorData) => {
            console.error('Socket error:', errorData);
            setError(errorData.message);
            setIsLoading(false);
        });

        return newSocket;
    }, [userId, userType, fetchSuppliers]);

    // Attempt reconnection
    const attemptReconnect = useCallback(() => {
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            setConnectionStatus('failed');
            setError('Maximum reconnection attempts reached');
            return;
        }

        setConnectionStatus('reconnecting');
        reconnectAttemptsRef.current += 1;

        reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnection attempt ${reconnectAttemptsRef.current}`);
            connect();
        }, Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000));
    }, [connect]);

    // Manual reconnect
    const reconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectAttemptsRef.current = 0;
        disconnect();
        setTimeout(connect, 1000);
    }, [connect]);

    // Update conversation with new message
    const updateConversationWithMessage = useCallback((message) => {
        setConversations(prev => {
            return prev.map(conv => {
                const isThisConversation =
                    (conv.type === 'customer' && message.senderId === conv.id && message.senderType === 'customer') ||
                    (conv.type === 'supplier' && message.senderId === conv.id && message.senderType === 'supplier');

                if (isThisConversation) {
                    return {
                        ...conv,
                        lastMessage: message.content,
                        lastMessageTime: message.createdAt,
                        unreadCount: (conv.unreadCount || 0) + 1
                    };
                }
                return conv;
            });
        });
    }, []);

    // Send message
    const sendMessage = useCallback((receiverId, receiverType, content) => {
        if (!socketRef.current || !isConnected || !content.trim()) {
            return false;
        }

        const tempId = Date.now().toString();
        const tempMessage = {
            tempId,
            content: content.trim(),
            senderId: parseInt(userId),
            senderType: userType,
            senderName: currentUser?.name || 'You',
            createdAt: new Date().toISOString(),
            isOwn: true,
            status: 'sending'
        };

        // Add temp message immediately
        setMessages(prev => [...prev, tempMessage]);

        socketRef.current.emit('sendMessage', {
            tempId,
            receiverId: parseInt(receiverId),
            receiverType,
            content: content.trim()
        });

        return true;
    }, [isConnected, userId, userType, currentUser]);

    // Typing indicators
    const sendTyping = useCallback((conversationId, conversationType) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('typing', {
                conversationId: parseInt(conversationId),
                conversationType
            });
        }
    }, [isConnected]);

    const sendStopTyping = useCallback((conversationId, conversationType) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('stopTyping', {
                conversationId: parseInt(conversationId),
                conversationType
            });
        }
    }, [isConnected]);

    // Load conversation history
    const loadConversation = useCallback((otherUserId, otherUserType) => {
        if (!socketRef.current || !isConnected) return;

        setIsLoading(true);
        setMessages([]);
        socketRef.current.emit('getConversation', {
            otherUserId: parseInt(otherUserId),
            otherUserType
        });
    }, [isConnected]);

    // Load conversations list
    const loadConversations = useCallback(() => {
        if (!socketRef.current || !isConnected) return;

        socketRef.current.emit('getConversations');
    }, [isConnected]);

    // Mark conversation as read
    const markConversationAsRead = useCallback((conversationId, conversationType) => {
        if (!socketRef.current || !isConnected) return;

        socketRef.current.emit('markAsRead', {
            conversationId: parseInt(conversationId),
            conversationType
        });

        // Update local state
        setConversations(prev => {
            return prev.map(conv => {
                if (conv.id === conversationId && conv.type === conversationType) {
                    return { ...conv, unreadCount: 0 };
                }
                return conv;
            });
        });
    }, [isConnected]);

    // Check if user is online
    const isUserOnline = useCallback((userId, userType) => {
        return onlineUsers.some(user => user.id === parseInt(userId) && user.type === userType);
    }, [onlineUsers]);

    // Get total unread count
    const getUnreadCount = useCallback(() => {
        return conversations.reduce((total, conv) => {
            return total + (conv.unreadCount || 0);
        }, 0);
    }, [conversations]);

    // Get all available conversations (existing + suppliers for customers)
    const getAllConversations = useCallback(() => {
        if (userType === 'customer') {
            // For customers, merge existing conversations with available suppliers
            const existingConversationIds = conversations.map(conv =>
                conv.type === 'supplier' ? conv.id : null
            ).filter(id => id !== null);

            const availableSuppliers = suppliers.filter(supplier =>
                !existingConversationIds.includes(supplier.id)
            );

            return [...conversations, ...availableSuppliers];
        }

        return conversations;
    }, [conversations, suppliers, userType]);

    // Get filtered suppliers (only approved and verified)
    const getApprovedSuppliers = useCallback(() => {
        return suppliers.filter(supplier => supplier.isApproved && supplier.isVerify);
    }, [suppliers]);

    // Disconnect
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsConnected(false);
            setConnectionStatus('disconnected');
            setCurrentUser(null);
            setMessages([]);
            setConversations([]);
            setSuppliers([]);
            setOnlineUsers([]);
            setTypingUsers([]);
            setError(null);
        }
    }, []);

    // Auto connect when userId and userType are provided
    useEffect(() => {
        if (userId && userType && !socketRef.current) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [userId, userType, connect, disconnect]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    return {
        socket,
        isConnected,
        connectionStatus,
        messages,
        conversations: getAllConversations(),
        suppliers,
        approvedSuppliers: getApprovedSuppliers(),
        currentUser,
        onlineUsers,
        typingUsers,
        error,
        isLoading,
        sendMessage,
        sendTyping,
        sendStopTyping,
        loadConversation,
        loadConversations,
        markConversationAsRead,
        reconnect,
        connect,
        disconnect,
        clearError: () => setError(null),
        isUserOnline,
        getUnreadCount,
        fetchSuppliers
    };
};

export default useSocket;