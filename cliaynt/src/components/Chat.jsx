import React, { useState, useEffect, useRef } from 'react';
import {
    Send, User, Building2, MessageCircle, AlertCircle, Loader2,
    ArrowLeft, Wifi, WifiOff, RefreshCw, Phone, Video,
    MoreVertical, Paperclip, Smile, Search, Archive, Trash2,
    Moon, Sun, Check, CheckCheck, Reply, Edit3
} from 'lucide-react';
import useSocket from './chatHook/useSocket';


const Chat = ({ userId: propUserId, userType: propUserType }) => {
    // State
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [showConversationsList, setShowConversationsList] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [focusedInput, setFocusedInput] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [holdingMessage, setHoldingMessage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [longPressTimer, setLongPressTimer] = useState(null);

    // Refs
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Get user info
    const userId = propUserId || localStorage.getItem('userId');
    const userType = propUserType || localStorage.getItem('userType');

    // Socket hook - NOW INCLUDES deleteMessage function
    const {
        isConnected,
        messages,
        conversations,
        onlineUsers,
        typingUsers,
        error,
        isLoading,
        sendMessage,
        deleteMessage, // NEW: Get delete function from hook
        loadConversation,
        loadConversations,
        markConversationAsRead,
        reconnect,
        clearError,
        isUserOnline,
        getUnreadCount
    } = useSocket(userId, userType);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load conversations when connected
    useEffect(() => {
        if (isConnected) {
            loadConversations();
        }
    }, [isConnected, loadConversations]);

    // Message handling
    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedConversation) return;

        const success = sendMessage(
            selectedConversation.id,
            selectedConversation.type,
            messageInput
        );

        if (success) {
            setMessageInput('');
            setFocusedInput('message');
        }
    };

    const handleKeyPress = (e, type) => {
        if (e.key === 'Enter' && !e.shiftKey && type === 'message') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Long press handlers for message deletion
    const handleMouseDown = (message, e) => {
        e.preventDefault();
        e.stopPropagation();

        // Only allow deletion of own messages
        if (message.senderId !== parseInt(userId)) return;

        // Prevent scrolling during long press
        if (messagesContainerRef.current) {
            messagesContainerRef.current.style.overflowY = 'hidden';
        }

        const timer = setTimeout(() => {
            setMessageToDelete(message);
            setShowDeleteModal(true);
            setHoldingMessage(null);
        }, 800);
        setLongPressTimer(timer);
        setHoldingMessage(message.id);
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Restore scrolling
        if (messagesContainerRef.current) {
            messagesContainerRef.current.style.overflowY = 'auto';
        }

        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setHoldingMessage(null);
    };

    const handleTouchStart = (message, e) => {
        e.preventDefault();
        e.stopPropagation();

        // Only allow deletion of own messages
        if (message.senderId !== parseInt(userId)) return;

        // Prevent scrolling during long press
        if (messagesContainerRef.current) {
            messagesContainerRef.current.style.overflowY = 'hidden';
        }

        const timer = setTimeout(() => {
            setMessageToDelete(message);
            setShowDeleteModal(true);
            setHoldingMessage(null);
        }, 800);
        setLongPressTimer(timer);
        setHoldingMessage(message.id);
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Restore scrolling
        if (messagesContainerRef.current) {
            messagesContainerRef.current.style.overflowY = 'auto';
        }

        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setHoldingMessage(null);
    };

    // UPDATED: Use socket delete instead of API call
    const handleDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            const success = deleteMessage(messageToDelete.id);

            if (success) {
                console.log('Delete message request sent via socket');
            } else {
                console.error('Failed to send delete message request');
                setError('Failed to delete message - not connected');
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
            setError('Failed to delete message');
        }

        setShowDeleteModal(false);
        setMessageToDelete(null);
    };

    // Conversation selection
    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        setShowConversationsList(false);
        setFocusedInput('message');

        if (conversation.lastMessage) {
            loadConversation(conversation.id, conversation.type);
            markConversationAsRead(conversation.id, conversation.type);
        }
    };

    // Helpers
    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'No messages';
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Filter conversations based on user type
    const filteredConversations = conversations
        .filter(conv => {
            // If user is supplier, only show customers who have messaged them
            if (userType === 'supplier') {
                return conv.type === 'customer' && conv.lastMessage;
            }
            // If user is customer, show all suppliers
            return true;
        })
        .filter(conv =>
            conv.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Theme classes
    const themeClasses = {
        bg: darkMode ? 'bg-gray-900' : 'bg-gray-100',
        cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
        border: darkMode ? 'border-gray-700' : 'border-gray-200',
        text: darkMode ? 'text-gray-100' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
        textMuted: darkMode ? 'text-gray-500' : 'text-gray-500',
        hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
        selected: darkMode ? 'bg-blue-900/50' : 'bg-blue-50',
        input: darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900',
        messagesBg: darkMode ? 'bg-gray-900' : 'bg-gray-50'
    };

    // Message Bubble Component - WhatsApp-style positioning
    const MessageBubble = ({ message }) => {
        const isOwnMessage = message.senderId === parseInt(userId);

        return (
            <div className={`flex mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative select-none cursor-pointer transition-all duration-200 ${holdingMessage === message.id ? 'scale-95 opacity-80' : ''
                        } ${isOwnMessage
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'} rounded-bl-none`
                        }`}
                    onMouseDown={(e) => handleMouseDown(message, e)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={(e) => handleTouchStart(message, e)}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    style={{
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                        userSelect: 'none',
                        WebkitTouchCallout: 'none'
                    }}
                >
                    {/* Sender name inside bubble for received messages */}
                    {!isOwnMessage && (
                        <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {message.senderName}
                        </p>
                    )}

                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                    <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <p className={`text-xs ${isOwnMessage
                            ? 'text-white/70'
                            : darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            {formatTime(message.createdAt || message.timestamp)}
                        </p>
                        {isOwnMessage && (
                            <div className="flex ml-1">
                                {message.delivered ? (
                                    <CheckCheck className="w-3 h-3 text-white/70" />
                                ) : (
                                    <Check className="w-3 h-3 text-white/70" />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Show delete indicator for own messages */}
                    {isOwnMessage && (
                        <div className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Delete Modal Component
    const DeleteModal = () => (
        showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className={`${themeClasses.cardBg} rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className={`font-semibold ${themeClasses.text}`}>Delete Message</h3>
                            <p className={`text-sm ${themeClasses.textSecondary}`}>This action cannot be undone</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className={`flex-1 py-2 px-4 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${themeClasses.text} transition-colors`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteMessage}
                            className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    // Conversation List Component
    const ConversationList = () => (
        <div className={`w-full md:w-80 ${themeClasses.cardBg} ${themeClasses.border} border-r flex flex-col h-full`}>
            <div className={`p-4 ${themeClasses.border} border-b ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} flex-shrink-0`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-lg font-bold ${themeClasses.text}`}>
                        {userType === 'customer' ? 'Suppliers' : 'Customers'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-xl ${themeClasses.hover} transition-colors`}
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                        {!isConnected && (
                            <button
                                onClick={reconnect}
                                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reconnect
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={themeClasses.textSecondary}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            <div className={`p-4 ${themeClasses.border} border-b flex-shrink-0`}>
                <div className="relative">
                    <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setFocusedInput('search');
                        }}
                        onKeyPress={(e) => handleKeyPress(e, 'search')}
                        className={`w-full pl-10 pr-4 py-3 ${themeClasses.input} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        autoFocus={focusedInput === 'search'}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                {filteredConversations.map(conv => (
                    <div
                        key={`${conv.type}_${conv.id}`}
                        className={`p-4 ${themeClasses.border} border-b ${themeClasses.hover} cursor-pointer transition-all duration-200 ${selectedConversation?.id === conv.id ? themeClasses.selected : ''
                            }`}
                        onClick={() => handleSelectConversation(conv)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center overflow-hidden`}>
                                    {conv.type === 'customer' ? (
                                        conv.image == null ? (
                                            <User className={`w-6 h-6 ${themeClasses.textMuted}`} />
                                        ) : (
                                            <img
                                                className='w-full h-full object-cover'
                                                src={`http://localhost:3032/images/${conv.image}`}
                                                alt={conv.name}
                                            />
                                        )
                                    ) : (
                                        <Building2 className={`w-6 h-6 ${themeClasses.textMuted}`} />
                                    )}
                                </div>
                                {isUserOnline(conv.id, conv.type) && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className={`font-semibold truncate ${themeClasses.text}`}>{conv.name}</h3>
                                    <span className={`text-xs ${themeClasses.textMuted} flex-shrink-0 ml-2`}>
                                        {formatRelativeTime(conv.lastMessageTime)}
                                    </span>
                                </div>
                                <p className={`text-sm ${themeClasses.textSecondary} truncate`}>
                                    {conv.lastMessage || 'No messages yet'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredConversations.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <MessageCircle className={`w-12 h-12 mb-3 ${themeClasses.textMuted}`} />
                        <p className={`${themeClasses.textMuted}`}>
                            {userType === 'supplier' ? 'No customer messages yet' : 'No conversations found'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    // Chat Window Component
    const ChatWindow = () => (
        <div className={`flex-1 flex flex-col ${themeClasses.messagesBg} h-full`}>
            {selectedConversation ? (
                <>
                    <div className={`p-4 ${themeClasses.cardBg} ${themeClasses.border} border-b flex items-center gap-3 shadow-sm flex-shrink-0`}>
                        <button
                            onClick={() => {
                                setShowConversationsList(true);
                                setFocusedInput('search');
                            }}
                            className={`md:hidden p-2 ${themeClasses.hover} rounded-xl transition-colors`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <h3 className={`font-semibold ${themeClasses.text}`}>{selectedConversation.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs ${themeClasses.textSecondary} capitalize`}>
                                    {selectedConversation.type}
                                </span>
                                {isUserOnline(selectedConversation.id, selectedConversation.type) && (
                                    <span className="text-xs text-green-500 flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        Online
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
                        style={{
                            touchAction: 'pan-y',
                            overscrollBehavior: 'contain'
                        }}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32">
                                <MessageCircle className={`w-16 h-16 mb-4 ${themeClasses.textMuted}`} />
                                <h3 className={`text-lg font-medium mb-2 ${themeClasses.text}`}>Start the conversation</h3>
                                <p className={themeClasses.textSecondary}>Send your first message to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {messages.map(message => (
                                    <MessageBubble key={message.id} message={message} />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <div className={`p-4 ${themeClasses.cardBg} ${themeClasses.border} border-t flex-shrink-0`}>
                        <div className="flex items-end gap-3">
                            <button className={`p-3 ${themeClasses.hover} rounded-xl transition-colors`}>
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <div className="flex-1">
                                <input
                                    value={messageInput}
                                    onChange={(e) => {
                                        setMessageInput(e.target.value);
                                        setFocusedInput('message');
                                    }}
                                    onKeyPress={(e) => handleKeyPress(e, 'message')}
                                    placeholder="Type your message..."
                                    className={`w-full p-3 ${themeClasses.input} rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all max-h-32`}
                                    rows="1"
                                    autoFocus={focusedInput === 'message'}
                                />
                            </div>
                            <button className={`p-3 ${themeClasses.hover} rounded-xl transition-colors`}>
                                <Smile className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim() || !isConnected}
                                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                        {typingUsers.length > 0 && (
                            <div className={`mt-2 text-sm ${themeClasses.textSecondary}`}>
                                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <MessageCircle className={`w-20 h-20 mx-auto mb-6 ${themeClasses.textMuted}`} />
                        <h3 className={`text-xl font-semibold mb-2 ${themeClasses.text}`}>Select a conversation</h3>
                        <p className={themeClasses.textSecondary}>Choose a conversation from the sidebar to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className={`h-screen flex ${themeClasses.bg}`}>
            {/* Mobile view */}
            <div className="md:hidden w-full flex h-full">
                {showConversationsList ? <ConversationList /> : <ChatWindow />}
            </div>

            {/* Desktop view */}
            <div className="hidden md:flex w-full h-full">
                <ConversationList />
                <ChatWindow />
            </div>

            <DeleteModal />
        </div>
    );
};

export default Chat;