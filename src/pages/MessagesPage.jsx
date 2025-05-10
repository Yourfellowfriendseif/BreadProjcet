import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import "./MessagesPage.css";

export default function MessagesPage() {
  const { userId } = useParams();
  const { user } = useApp();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    if (userId) {
      // If we have a userId in the URL, set it as the selected chat user
      setChatUser({ _id: userId });
    }
  }, [userId]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // Find the other user in the conversation
    const otherUser = chat.participants.find((p) => p._id !== user._id);
    if (otherUser) {
      setChatUser(otherUser);
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Messages</h1>

      <div className="messages-container">
        {/* Chat list sidebar */}
        <div className="messages-sidebar">
          <ChatList
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* Chat window or empty state */}
        <div className="messages-main">
          {chatUser ? (
            <ChatWindow
              recipientId={chatUser._id}
              onClose={() => {
                setChatUser(null);
                setSelectedChat(null);
              }}
            />
          ) : (
            <div className="messages-empty-state">
              <div className="messages-empty-icon">💬</div>
              <h2 className="messages-empty-title">Your Messages</h2>
              <p className="messages-empty-text">
                Select a conversation from the list or start a new one from a
                bread post.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
