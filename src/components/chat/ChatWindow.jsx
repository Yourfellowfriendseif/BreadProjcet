import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../../api/chatAPI';
import { socketService } from '../../api/socketService';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../LoadingSpinner';
import './ChatWindow.css';

export default function ChatWindow({ recipientId, onClose }) {
  const { user } = useApp();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    loadMessages();
    setupSocketListeners();
    loadRecipientInfo();

    return () => {
      socketService.removeAllListeners();
    };
  }, [recipientId]);

  const setupSocketListeners = () => {
    socketService.onMessage((message) => {
      if (message.sender === recipientId || message.recipient === recipientId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });
  };

  const loadRecipientInfo = async () => {
    try {
      const response = await chatAPI.getUserInfo(recipientId);
      setRecipient(response.data);
    } catch (error) {
      console.error('Error loading recipient info:', error);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getMessages(recipientId);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      setError(error.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const response = await chatAPI.sendMessage(recipientId, newMessage);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="chat-window-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-window-error">
        <p className="chat-window-error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-window-header">
        <div className="chat-window-header-user">
          <img
            src={recipient?.photo_url || '/default-avatar.png'}
            alt={recipient?.username}
            className="chat-window-avatar"
          />
          <div>
            <h3 className="chat-window-username">{recipient?.username}</h3>
            <p className="chat-window-status">
              {recipient?.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="chat-window-close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="chat-window-messages">
        {messages.map((message) => {
          const isSender = message.sender === user._id;
          return (
            <div
              key={message._id}
              className={`chat-window-message ${
                isSender ? 'chat-window-message-sent' : 'chat-window-message-received'
              }`}
            >
              <div
                className={`chat-window-message-content ${
                  isSender
                    ? 'chat-window-message-content-sent'
                    : 'chat-window-message-content-received'
                }`}
              >
                <p>{message.content}</p>
                <p className={`chat-window-message-time ${
                  isSender ? 'chat-window-message-time-sent' : 'chat-window-message-time-received'
                }`}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="chat-window-input">
        <div className="chat-window-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="chat-window-input-field"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`chat-window-send-button ${
              !newMessage.trim() || sending
                ? 'chat-window-send-button-disabled'
                : 'chat-window-send-button-enabled'
            }`}
          >
            {sending ? (
              <span className="chat-window-send-button-content">
                <LoadingSpinner size="sm" />
                <span>Sending...</span>
              </span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}