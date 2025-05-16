import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { chatAPI } from "../../api/chatAPI";
import { socketService } from "../../api/socketService";
import { formatDistanceToNow } from "date-fns";
import "./ChatList.css";

const ChatList = ({ selectedChat, onSelectChat }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();

    // Listen for new messages to update conversation list
    socketService.on("chat:message:new", handleNewMessage);
    socketService.on("chat:message:read", handleMessageRead);

    return () => {
      socketService.off("chat:message:new", handleNewMessage);
      socketService.off("chat:message:read", handleMessageRead);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatAPI.getConversations();
      const conversationList = response?.data?.conversations || [];
      setConversations(sortConversationsByDate(conversationList));
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Failed to load conversations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    if (!message || !message.sender || !message.recipient) return;

    setConversations((prev) => {
      // Find if conversation exists
      const conversationIndex = prev.findIndex((conv) => {
        const participants = conv.participants || [];
        return (
          participants.some((p) => p._id === message.sender._id) &&
          participants.some((p) => p._id === message.recipient._id)
      );
      });

      let updatedConversations = [...prev];

      if (conversationIndex !== -1) {
        // Update existing conversation
        const conversation = { ...updatedConversations[conversationIndex] };
        conversation.lastMessage = message;
        conversation.updatedAt = message.createdAt;
        
        if (message.sender._id !== user?._id) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1;
        }
        
        updatedConversations[conversationIndex] = conversation;
      } else if (message.sender._id === user?._id || message.recipient._id === user?._id) {
        // Create new conversation
        const otherUser = message.sender._id === user?._id ? message.recipient : message.sender;
        const newConversation = {
          _id: `temp_${Date.now()}`,
          participants: [user, otherUser],
          lastMessage: message,
          updatedAt: message.createdAt,
          unreadCount: message.sender._id !== user?._id ? 1 : 0,
        };
        updatedConversations = [newConversation, ...updatedConversations];
      }

      return sortConversationsByDate(updatedConversations);
    });
  };

  const handleMessageRead = ({ messageId, readBy }) => {
    if (!messageId || !readBy) return;

    setConversations((prev) => {
      return prev.map((conv) => {
        if (conv.lastMessage?._id === messageId && readBy === user?._id) {
          return {
            ...conv,
            unreadCount: 0,
          };
        }
        return conv;
      });
    });
  };

  const sortConversationsByDate = (conversations) => {
    return [...conversations].sort((a, b) => {
      const dateA = new Date(a?.updatedAt || a?.lastMessage?.createdAt || 0);
      const dateB = new Date(b?.updatedAt || b?.lastMessage?.createdAt || 0);
      return dateB - dateA;
    });
  };

  const handleChatSelect = (conversation) => {
    if (!conversation || !user) return;

    const otherUser = conversation.participants?.find(p => p._id !== user._id);
    if (!otherUser) return;

    if (onSelectChat) {
      onSelectChat(conversation);
    }

    // Navigate to the chat with the other user
      navigate(`/messages/${otherUser._id}`);
  };

  if (loading) {
    return <div className="chat-list-loading">Loading conversations...</div>;
  }

  if (error) {
    return (
      <div className="chat-list-error">
        <p>{error}</p>
        <button onClick={fetchConversations} className="chat-list-retry">
          Retry
        </button>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="chat-list-empty">
        <p>No conversations yet</p>
        <p className="chat-list-empty-subtitle">
          Start a conversation from a bread post
        </p>
      </div>
    );
  }

  return (
    <div className="chat-list">
      {conversations.map((conversation) => {
        if (!conversation || !conversation.participants) return null;

        const otherUser = conversation.participants.find(
          (p) => p._id !== user?._id
        );

        if (!otherUser) return null;

        return (
          <div
            key={conversation._id}
            className={`chat-list-item ${
              selectedChat?._id === conversation._id ? "chat-list-item-selected" : ""
            }`}
            onClick={() => handleChatSelect(conversation)}
          >
            <div className="chat-list-item-content">
              <div className="chat-list-avatar-container">
                <img
                  src={otherUser.photo_url || "/default-avatar.png"}
                  alt={otherUser.username || "User"}
                  className="chat-list-avatar-image"
                />
                {otherUser.isOnline && (
                  <span className="chat-list-online-indicator" />
                )}
              </div>
              <div className="chat-list-details">
                <div className="chat-list-header">
                  <span className="chat-list-username">
                    {otherUser.username || "Unknown user"}
                  </span>
                  <span className="chat-list-date">
                    {conversation.lastMessage?.createdAt
                      ? formatDistanceToNow(
                          new Date(conversation.lastMessage.createdAt),
                          { addSuffix: true }
                        )
                      : ""}
                  </span>
                </div>
                <div className="chat-list-message">
                  <span className="chat-list-message-text">
                    {conversation.lastMessage?.content || "No messages yet"}
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
