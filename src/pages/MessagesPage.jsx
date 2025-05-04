import { useState } from 'react';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import { useApp } from '../context/AppContext';

export default function MessagesPage() {
  const { user } = useApp();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSelectChat = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCloseChat = () => {
    setSelectedUserId(null);
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view messages</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6 h-[calc(100vh-12rem)]">
        {/* Chat List */}
        <div className="w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          </div>
          <ChatList 
            onSelectChat={handleSelectChat}
            selectedUserId={selectedUserId}
          />
        </div>

        {/* Chat Window or Empty State */}
        <div className="w-2/3">
          {selectedUserId ? (
            <ChatWindow
              recipientId={selectedUserId}
              onClose={handleCloseChat}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8">
              <svg
                className="w-20 h-20 text-gray-400 mb-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 text-center">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}