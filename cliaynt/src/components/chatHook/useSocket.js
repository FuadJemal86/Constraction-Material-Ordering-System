import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userId, userType) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const socketRef = useRef(null);

    // Connect to socket
    const connect = useCallback(() => {
        if (!userId || !userType) return;

        const newSocket = io('http://localhost:3032', {
            transports: ['websocket'],
            withCredentials: true
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Connection events
        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            newSocket.emit('join', { userId, userType });
        });

        newSocket.on('connected', (data) => {
            console.log('Successfully joined chat:', data);
            setIsConnected(true);
            setCurrentUser(data.user);
            setError(null);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server');
            setIsConnected(false);
        });

        // Message events
        newSocket.on('newMessage', (message) => {
            console.log('New message received:', message);
            setMessages(prev => [...prev, { ...message, isOwn: false }]);
        });

        newSocket.on('messageReceived', (message) => {
            console.log('Message sent successfully:', message);
            setMessages(prev => [...prev, { ...message, isOwn: true }]);
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

        // Error handling
        newSocket.on('error', (errorData) => {
            console.error('Socket error:', errorData);
            setError(errorData.message);
            setIsLoading(false);
        });

        return newSocket;
    }, [userId, userType]);

    // Send message
    const sendMessage = useCallback((receiverId, receiverType, content) => {
        if (!socketRef.current || !isConnected || !content.trim()) {
            return false;
        }

        socketRef.current.emit('sendMessage', {
            receiverId: parseInt(receiverId),
            receiverType,
            content: content.trim()
        });

        return true;
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

    // Disconnect
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsConnected(false);
            setCurrentUser(null);
            setMessages([]);
            setConversations([]);
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

    return {
        socket,
        isConnected,
        messages,
        conversations,
        currentUser,
        error,
        isLoading,
        sendMessage,
        loadConversation,
        loadConversations,
        connect,
        disconnect,
        clearError: () => setError(null)
    };
};

export default useSocket;