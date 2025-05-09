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
      const response = (await chatAPI.getConversations?.()) || {
        data: { conversations: [] },
      };
      setConversations(response.data?.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setConversations((prev) => {
      const conversationIndex = prev.findIndex(
        (conv) =>
          conv.participants.some((p) => p._id === message.sender._id) &&
          conv.participants.some((p) => p._id === message.recipient._id)
      );

      if (conversationIndex !== -1) {
        // Existing conversation
        const updatedConversations = [...prev];
        updatedConversations[conversationIndex] = {
          ...updatedConversations[conversationIndex],
          lastMessage: message,
          updatedAt: message.createdAt,
          unreadCount:
            message.sender._id !== user._id
              ? (updatedConversations[conversationIndex].unreadCount || 0) + 1
              : updatedConversations[conversationIndex].unreadCount,
        };
        // Sort conversations by latest message
        return sortConversationsByDate(updatedConversations);
      } else if (
        message.sender._id === user._id ||
        message.recipient._id === user._id
      ) {
        // New conversation
        const otherUser =
          message.sender._id === user._id ? message.recipient : message.sender;
        const newConversation = {
          _id: Date.now().toString(), // Temporary ID
          participants: [user, otherUser],
          lastMessage: message,
          updatedAt: message.createdAt,
          unreadCount: message.sender._id !== user._id ? 1 : 0,
        };
        return sortConversationsByDate([newConversation, ...prev]);
      }
      return prev;
    });
  };

  const handleMessageRead = ({ messageId, readBy }) => {
    setConversations((prev) => {
      return prev.map((conv) => {
        if (conv.lastMessage?._id === messageId) {
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
    return [...conversations].sort(
      (a, b) =>
        new Date(b.updatedAt || b.lastMessage?.createdAt || 0) -
        new Date(a.updatedAt || a.lastMessage?.createdAt || 0)
    );
  };

  const handleChatSelect = (conversation) => {
    if (onSelectChat) {
      onSelectChat(conversation);
    }

    // Find the other user in the conversation
    const otherUser = conversation.participants.find((p) => p._id !== user._id);
    if (otherUser) {
      navigate(`/messages/${otherUser._id}`);
    }
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
        const otherUser = conversation.participants.find(
          (p) => p._id !== user._id
        );
        return (
          <div
            key={conversation._id}
            className={`chat-list-item ${
              selectedChat?._id === conversation._id
                ? "chat-list-item-selected"
                : ""
            }`}
            onClick={() => handleChatSelect(conversation)}
          >
            <div className="chat-list-item-content">
              <div className="chat-list-avatar-container">
                <img
                  src={otherUser?.avatar || "/default-avatar.png"}
                  alt={otherUser?.username || "User"}
                  className="chat-list-avatar-image"
                />
              </div>
              <div className="chat-list-details">
                <div className="chat-list-header">
                  <span className="chat-list-username">
                    {otherUser?.username || "Unknown user"}
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
