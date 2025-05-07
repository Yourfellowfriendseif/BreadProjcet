import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { chatAPI } from '../api/chatAPI';
import { socketService } from '../api/socketService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MessagesPage() {
  const { user } = useApp();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadConversations();
    setupChatListeners();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setupChatListeners = () => {
    socketService.onNewMessage( (message) => {
      if (selectedConversation?._id === message.conversation_id) {
        setMessages(prev => [...prev, message]);
        chatAPI.markAsRead([message._id]);
      } else {
        setConversations(prev => 
          prev.map(conv => 
            conv._id === message.conversation_id 
              ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
              : conv
          )
        );
      }
    });

    socketService.onMessageRead( (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId ? { ...msg, read: true } : msg
        )
      );
    });

    socketService.onTyping( (data) => {
    if (selectedConversation?.participants.find(p => p._id === data.userId)) {
      setTyping(data.isTyping);
    }
  });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations();
      setConversations(response || []);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoading(true);
      const response = await chatAPI.getMessageHistory(conversationId);
      setMessages(response || []);
      // Mark messages as read
      const unreadMessages = response.filter(m => 
        !m.read && m.sender._id !== user._id
      );
      if (unreadMessages.length > 0) {
        await chatAPI.markAsRead(unreadMessages.map(m => m._id));
      }
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const recipient = selectedConversation.participants.find(
        p => p._id !== user._id
      );
      await chatAPI.sendMessage(recipient._id, newMessage.trim());
      setNewMessage('');
    } catch (err) {
      setError(err.message || 'Failed to send message');
    }
  };

  const handleTyping = () => {
    if (!selectedConversation) return;
    
    const recipient = selectedConversation.participants.find(
      p => p._id !== user._id
    );
    
    socketService.emitTyping(recipient._id, true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitTyping(recipient._id, false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading && !conversations.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== user._id);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex h-[80vh] border rounded-lg overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.map(conversation => {
              const otherUser = getOtherParticipant(conversation);
              return (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?._id === conversation._id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={otherUser.avatar || '/default-avatar.png'}
                        alt={otherUser.username}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{otherUser.username}</p>
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center">
                  <img
                    src={getOtherParticipant(selectedConversation).avatar || '/default-avatar.png'}
                    alt={getOtherParticipant(selectedConversation).username}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <h3 className="text-lg font-medium">
                    {getOtherParticipant(selectedConversation).username}
                  </h3>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender._id === user._id ? 'justify-end' : 'justify-start'
                    } mb-4`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender._id === user._id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className="text-xs mt-1 flex items-center gap-1">
                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                        {message.sender._id === user._id && message.read && (
                          <span className="text-blue-200">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="text-gray-500 italic">
                    {getOtherParticipant(selectedConversation).username} is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleTyping}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}