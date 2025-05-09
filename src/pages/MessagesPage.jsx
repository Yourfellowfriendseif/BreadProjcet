import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { chatAPI } from '../api/chatAPI';
import { socketService } from '../api/socketService';
import LoadingSpinner from '../components/LoadingSpinner';
import './MessagesPage.css';

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
    socketService.onNewMessage((message) => {
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

    socketService.onMessageRead((data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId ? { ...msg, read: true } : msg
        )
      );
    });

    socketService.onTyping((data) => {
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
      <div className="messages-page-loading">
        <LoadingSpinner />
      </div>
    );
  }

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== user._id);
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Conversations List */}
        <div className="messages-list">
          <div className="messages-list-header">
            <h2 className="messages-list-title">Messages</h2>
          </div>
          <div className="messages-list-content">
            {conversations.map(conversation => {
              const otherUser = getOtherParticipant(conversation);
              return (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`messages-conversation ${
                    selectedConversation?._id === conversation._id ? 'messages-conversation-selected' : ''
                  }`}
                >
                  <div className="messages-conversation-content">
                    <div className="messages-conversation-user">
                      <img
                        src={otherUser.avatar || '/default-avatar.png'}
                        alt={otherUser.username}
                        className="messages-conversation-avatar"
                      />
                      <div className="messages-conversation-info">
                        <p className="messages-conversation-username">{otherUser.username}</p>
                        {conversation.lastMessage && (
                          <p className="messages-conversation-last-message">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="messages-conversation-unread">
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
        <div className="messages-chat">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="messages-chat-header">
                <div className="messages-chat-user">
                  <img
                    src={getOtherParticipant(selectedConversation).avatar || '/default-avatar.png'}
                    alt={getOtherParticipant(selectedConversation).username}
                    className="messages-chat-avatar"
                  />
                  <h3 className="messages-chat-username">
                    {getOtherParticipant(selectedConversation).username}
                  </h3>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-content">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`messages-message ${
                      message.sender._id === user._id ? 'messages-message-sent' : 'messages-message-received'
                    }`}
                  >
                    <div className="messages-message-content">
                      <p>{message.content}</p>
                      <div className="messages-message-time">
                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                        {message.sender._id === user._id && message.read && (
                          <span className="messages-message-read">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="messages-typing">
                    {getOtherParticipant(selectedConversation).username} is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="messages-input-container">
                <form onSubmit={handleSendMessage} className="messages-input-form">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleTyping}
                    placeholder="Type a message..."
                    className="messages-input"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="messages-send-button"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="messages-empty">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}