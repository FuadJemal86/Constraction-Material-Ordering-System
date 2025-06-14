import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Building2, MessageCircle, AlertCircle, Loader2, ArrowLeft, Wifi, WifiOff, RefreshCw, Phone, Video, MoreVertical, Paperclip, Smile, Search, Archive, Trash2 } from 'lucide-react';
import useSocket from './chatHook/useSocket';

const Chat = ({ userId: propUserId, userType: propUserType }) => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [showConversationsList, setShowConversationsList] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    // Get userId and userType from localStorage if not provided as props
    const userId = propUserId || localStorage.getItem('userId');
    const userType = propUserType || localStorage.getItem('userType');

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const {
        isConnected,
        connectionStatus,
        messages,
        conversations,
        suppliers,
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
        clearError,
        isUserOnline,
        getUnreadCount,
        fetchSuppliers
    } = useSocket(userId, userType);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load conversations when connected
    useEffect(() => {
        if (isConnected) {
            loadConversations();
        }
    }, [isConnected, loadConversations]);

    // Handle typing indicators
    const handleInputChange = (e) => {
        setMessageInput(e.target.value);

        if (selectedConversation && e.target.value.trim()) {
            sendTyping(selectedConversation.id, selectedConversation.type);
        } else if (selectedConversation) {
            sendStopTyping(selectedConversation.id, selectedConversation.type);
        }
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedConversation) return;

        const success = sendMessage(
            selectedConversation.id,
            selectedConversation.type,
            messageInput
        );

        if (success) {
            setMessageInput('');
            sendStopTyping(selectedConversation.id, selectedConversation.type);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && selectedConversation) {
            // Handle file upload logic here
            console.log('File selected:', file);
            // You would implement file upload to your backend here
        }
    };

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
        setShowConversationsList(false);

        // Only load conversation if it has previous messages
        if (conversation.lastMessage) {
            loadConversation(conversation.id, conversation.type);
            markConversationAsRead(conversation.id, conversation.type);
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'No messages';

        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return formatTime(dateString);
    };

    const getTypingIndicator = () => {
        if (!selectedConversation) return null;

        const typingInThisConversation = typingUsers.filter(user =>
            user.id === selectedConversation.id && user.type === selectedConversation.type
        );

        if (typingInThisConversation.length === 0) return null;

        return (
            <div className="px-4 py-2 text-sm text-gray-500 italic">
                {typingInThisConversation[0].name} is typing...
            </div>
        );
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ConversationsList = () => (
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        {userType === 'customer' ? 'Suppliers' : 'Conversations'}
                        {getUnreadCount() > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {getUnreadCount()}
                            </span>
                        )}
                    </h2>
                    <div className="flex items-center gap-2">
                        {userType === 'customer' && (
                            <button
                                onClick={fetchSuppliers}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Refresh suppliers"
                            >
                                <RefreshCw className="w-4 h-4 text-gray-500" />
                            </button>
                        )}
                        {isConnected ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                        ) : (
                            <WifiOff className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                </div>
                {currentUser && (
                    <p className="text-sm text-gray-600 mt-1">
                        {currentUser.name} ({currentUser.type})
                    </p>
                )}
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>
                            {searchQuery
                                ? 'No conversations found'
                                : userType === 'customer'
                                    ? 'No suppliers available'
                                    : 'No conversations yet'
                            }
                        </p>
                        {!isConnected && (
                            <button
                                onClick={reconnect}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                            >
                                Reconnect
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Show conversations with messages first */}
                        {filteredConversations
                            .filter(conv => conv.lastMessage)
                            .map((conversation) => {
                                const isOnline = isUserOnline(conversation.id, conversation.type);
                                const unreadCount = conversation.unreadCount || 0;

                                return (
                                    <ConversationItem
                                        key={`${conversation.type}_${conversation.id}`}
                                        conversation={conversation}
                                        isOnline={isOnline}
                                        unreadCount={unreadCount}
                                        isSelected={selectedConversation?.id === conversation.id &&
                                            selectedConversation?.type === conversation.type}
                                        onClick={() => handleConversationSelect(conversation)}
                                        formatRelativeTime={formatRelativeTime}
                                    />
                                );
                            })}

                        {/* Show available suppliers for customers (without existing conversations) */}
                        {userType === 'customer' && filteredConversations.filter(conv => !conv.lastMessage).length > 0 && (
                            <>
                                <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
                                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                        Available Suppliers
                                    </p>
                                </div>
                                {filteredConversations
                                    .filter(conv => !conv.lastMessage)
                                    .map((supplier) => {
                                        const isOnline = isUserOnline(supplier.id, supplier.type);

                                        return (
                                            <ConversationItem
                                                key={`supplier_${supplier.id}`}
                                                conversation={supplier}
                                                isOnline={isOnline}
                                                unreadCount={0}
                                                isSelected={selectedConversation?.id === supplier.id &&
                                                    selectedConversation?.type === supplier.type}
                                                onClick={() => handleConversationSelect(supplier)}
                                                formatRelativeTime={formatRelativeTime}
                                                isAvailable={true}
                                            />
                                        );
                                    })}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    const ConversationItem = ({
        conversation,
        isOnline,
        unreadCount,
        isSelected,
        onClick,
        formatRelativeTime,
        isAvailable = false
    }) => (
        <div
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : ''
                }`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {conversation.image ? (
                            <img
                                src={conversation.image}
                                alt={conversation.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            conversation.type === 'customer' ?
                                <User className="w-5 h-5 text-gray-500" /> :
                                <Building2 className="w-5 h-5 text-gray-500" />
                        )}
                    </div>
                    {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className={`font-medium truncate ${unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-900'
                            }`}>
                            {conversation.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            {!isAvailable && (
                                <span className="text-xs text-gray-500">
                                    {formatRelativeTime(conversation.lastMessageTime)}
                                </span>
                            )}
                            {unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className={`text-sm truncate mt-1 ${unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-600'
                        }`}>
                        {conversation.lastMessage || (isAvailable ? 'Start a conversation' : 'No messages yet')}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${conversation.type === 'customer'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}>
                            {conversation.type}
                        </span>
                        {isOnline && (
                            <span className="text-xs text-green-600 font-medium">
                                Online
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const MessageBubble = ({ message }) => {
        const isOwnMessage = message.senderId === userId;

        return (
            <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                    }`}>
                    {!isOwnMessage && (
                        <p className="text-xs font-medium mb-1 text-gray-600">
                            {message.senderName}
                        </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        {formatTime(message.timestamp)}
                        {isOwnMessage && message.status && (
                            <span className="ml-2">
                                {message.status === 'delivered' ? '✓' :
                                    message.status === 'read' ? '✓✓' : '⏱'}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        );
    };

    const ChatWindow = () => (
        <div className="flex-1 flex flex-col bg-gray-50">
            {selectedConversation ? (
                <>
                    {/* Chat Header */}
                    <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3">
                        <button
                            onClick={() => setShowConversationsList(true)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                {selectedConversation.image ? (
                                    <img
                                        src={selectedConversation.image}
                                        alt={selectedConversation.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    selectedConversation.type === 'customer' ?
                                        <User className="w-4 h-4 text-gray-500" /> :
                                        <Building2 className="w-4 h-4 text-gray-500" />
                                )}
                            </div>
                            {isUserOnline(selectedConversation.id, selectedConversation.type) && (
                                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                                {selectedConversation.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 capitalize">
                                    {selectedConversation.type}
                                </span>
                                {isUserOnline(selectedConversation.id, selectedConversation.type) && (
                                    <span className="text-xs text-green-600 font-medium">
                                        • Online
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {connectionStatus === 'reconnecting' && (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            )}
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Phone className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Video className="w-4 h-4 text-gray-500" />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                                {showMoreOptions && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <Archive className="w-4 h-4" />
                                            Archive Chat
                                        </button>
                                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                                            <Trash2 className="w-4 h-4" />
                                            Delete Chat
                                        </button>
                                    </div>
                                )}
                            </div>
                            {!isConnected && (
                                <button
                                    onClick={reconnect}
                                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Reconnect
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                                <MessageCircle className="w-12 h-12 mb-2 text-gray-300" />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))
                        )}
                        {getTypingIndicator()}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border-t border-red-200 flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                            <button
                                onClick={clearError}
                                className="ml-auto text-sm hover:underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* Message Input */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex items-end gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setShowAttachments(!showAttachments)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                {showAttachments && (
                                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <Paperclip className="w-4 h-4" />
                                            Attach File
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 relative">
                                <textarea
                                    value={messageInput}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows="1"
                                    style={{ minHeight: '44px', maxHeight: '120px' }}
                                />
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <Smile className="w-5 h-5" />
                                </button>
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim() || !isConnected}
                                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    />
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-500">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                        <p>Choose a conversation from the sidebar to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    );

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setShowMoreOptions(false);
                setShowAttachments(false);
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Mobile: Show conversations list or chat window */}
            <div className="md:hidden w-full flex">
                {showConversationsList ? <ConversationsList /> : <ChatWindow />}
            </div>

            {/* Desktop: Show both side by side */}
            <div className="hidden md:flex w-full">
                <ConversationsList />
                <ChatWindow />
            </div>
        </div>
    );
};

export default Chat;