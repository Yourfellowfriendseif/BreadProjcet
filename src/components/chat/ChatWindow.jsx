import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../../api/chatAPI';
import { socketService } from '../../api/socketService';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../LoadingSpinner';

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
      <div className="h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={recipient?.photo_url || '/default-avatar.png'}
            alt={recipient?.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold">{recipient?.username}</h3>
            <p className="text-sm text-gray-500">
              {recipient?.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.sender === user._id;
          return (
            <div
              key={message._id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isSender
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  isSender ? 'text-blue-100' : 'text-gray-500'
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
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`px-4 py-2 rounded-lg ${
              !newMessage.trim() || sending
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {sending ? (
              <span className="flex items-center space-x-2">
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