import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { formatDistanceToNow } from 'date-fns';
import './ChatList.css';

const ChatList = ({ selectedChat, onSelectChat }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/chats/recent');
        if (!response.ok) throw new Error('Failed to fetch conversations');
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message) => {
      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(conv => conv._id === message.conversationId);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            lastMessage: message,
            unreadCount: (updated[index].unreadCount || 0) + 1
          };
        }
        return updated;
      });
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket]);

  const handleChatSelect = (conversation) => {
    onSelectChat(conversation);
    navigate(`/chat/${conversation._id}`);
  };

  if (loading) {
    return <div className="chat-list-empty">Loading conversations...</div>;
  }

  if (conversations.length === 0) {
    return <div className="chat-list-empty">No conversations yet</div>;
  }

  return (
    <div className="chat-list">
      {conversations.map((conversation) => {
        const otherUser = conversation.participants.find(p => p._id !== user._id);
        return (
          <div
            key={conversation._id}
            className={`chat-list-item ${selectedChat?._id === conversation._id ? 'chat-list-item-selected' : ''}`}
            onClick={() => handleChatSelect(conversation)}
          >
            <div className="chat-list-item-content">
              <div className="chat-list-avatar-container">
                {otherUser.avatar ? (
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.username}
                    className="chat-list-avatar-image"
                  />
                ) : (
                  <div className="chat-list-avatar">
                    <span className="chat-list-avatar-initial">
                      {otherUser.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="chat-list-details">
                <div className="chat-list-header">
                  <span className="chat-list-username">{otherUser.username}</span>
                  <span className="chat-list-date">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="chat-list-message">
                  <span className="chat-list-message-text">
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className="chat-list-unread">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;