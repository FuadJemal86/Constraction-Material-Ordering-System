import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Building2, MessageCircle, AlertCircle, Loader2, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import useSocket from './chatHook/useSocket';

const Chat = ({ userId, userType }) => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [showConversationsList, setShowConversationsList] = useState(true);

    const messagesEndRef = useRef(null);

    const {
        isConnected,
        connectionStatus,
        messages,
        conversations,
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
        getUnreadCount
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

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
        setShowConversationsList(false);
        loadConversation(conversation.id, conversation.type);
        markConversationAsRead(conversation.id, conversation.type);
    };

    const formatTime = (dateString) => {
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

    const ConversationsList = () => (
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Conversations
                        {getUnreadCount() > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {getUnreadCount()}
                            </span>
                        )}
                    </h2>
                    <div className="flex items-center gap-2">
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

            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No conversations yet</p>
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
                    conversations.map((conversation) => {
                        const isOnline = isUserOnline(conversation.id, conversation.type);
                        const unreadCount = conversation.unreadCount || 0;

                        return (
                            <div
                                key={`${conversation.type}_${conversation.id}`}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${selectedConversation?.id === conversation.id &&
                                    selectedConversation?.type === conversation.type
                                    ? 'bg-blue-50 border-blue-200'
                                    : ''
                                    }`}
                                onClick={() => handleConversationSelect(conversation)}
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
                                                <span className="text-xs text-gray-500">
                                                    {formatRelativeTime(conversation.lastMessageTime)}
                                                </span>
                                                {unreadCount > 0 && (
                                                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className={`text-sm truncate mt-1 ${unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-600'
                                            }`}>
                                            {conversation.lastMessage}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
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
                    })
                )}
            </div>
        </div>
    );

    const ChatWindow = () => (
        <div className="flex-1 flex flex-col bg-gray-50">
            {selectedConversation ? (
                <>
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

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                <span className="ml-2 text-gray-600">Loading messages...</span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex items-center justify-center py-8 text-gray-500">
                                <div className="text-center">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No messages yet</p>
                                    <p className="text-sm">Start the conversation!</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id || message.tempId}
                                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${message.isOwn
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-800 border border-gray-200'
                                            } ${message.status === 'sending' ? 'opacity-70' : ''}`}
                                    >
                                        {!message.isOwn && (
                                            <p className="text-xs font-medium mb-1 opacity-70">
                                                {message.senderName}
                                            </p>
                                        )}
                                        <p className="text-sm">{message.content}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className={`text-xs ${message.isOwn ? 'text-blue-100' : 'text-gray-500'
                                                }`}>
                                                {formatTime(message.createdAt)}
                                            </p>
                                            {message.isOwn && message.status && (
                                                <span className="text-xs text-blue-100 ml-2">
                                                    {message.status === 'sending' && '⏳'}
                                                    {message.status === 'sent' && '✓'}
                                                    {message.status === 'failed' && '✗'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {getTypingIndicator()}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={handleInputChange}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                onBlur={() => {
                                    if (selectedConversation) {
                                        sendStopTyping(selectedConversation.id, selectedConversation.type);
                                    }
                                }}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                                disabled={!isConnected}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!isConnected || !messageInput.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        {!isConnected && (
                            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                <WifiOff className="w-3 h-3" />
                                Disconnected - messages will be sent when reconnected
                            </p>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                        <p>Choose a conversation from the list to start chatting</p>
                    </div>
                </div>
            )}
        </div>
    );

    if (!userId || !userType) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
                    <p className="text-gray-600">Please provide userId and userType to use chat</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Connection Status */}
            <div className={`px-4 py-2 text-sm font-medium transition-colors ${isConnected
                ? 'bg-green-100 text-green-800'
                : connectionStatus === 'reconnecting'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        {isConnected ? (
                            <>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Connected
                            </>
                        ) : connectionStatus === 'reconnecting' ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Reconnecting...
                            </>
                        ) : (
                            <>
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Disconnected
                            </>
                        )}
                    </span>
                    {!isConnected && connectionStatus !== 'reconnecting' && (
                        <button
                            onClick={reconnect}
                            className="text-xs underline hover:no-underline"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="px-4 py-2 bg-red-100 text-red-800 text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </span>
                    <button
                        onClick={clearError}
                        className="text-red-600 hover:text-red-800 ml-2 text-lg leading-none"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Main Chat Interface */}
            <div className="flex-1 flex overflow-hidden">
                {/* Mobile: Show either conversations list or chat window */}
                <div className="md:hidden w-full">
                    {showConversationsList ? <ConversationsList /> : <ChatWindow />}
                </div>

                {/* Desktop: Show both side by side */}
                <div className="hidden md:flex w-full">
                    <ConversationsList />
                    <ChatWindow />
                </div>
            </div>
        </div>
    );
};

export default Chat;