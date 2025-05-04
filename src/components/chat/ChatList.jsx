import { useEffect, useState } from 'react';
import { getConversations } from '../../api/chatAPI';
import LoadingSpinner from '../LoadingSpinner';
import { useApp } from '../../context/AppContext';

export default function ChatList({ onSelectChat, selectedUserId }) {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, socket } = useApp();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setConversations(prev => {
        const conversationIndex = prev.findIndex(c => 
          c.participants.some(p => p._id === message.sender._id || p._id === message.recipient._id)
        );

        if (conversationIndex === -1) {
          // New conversation
          return [{
            participants: [message.sender, message.recipient],
            lastMessage: message.content,
            updatedAt: new Date().toISOString(),
            unreadCount: 1
          }, ...prev];
        }

        // Update existing conversation
        const newConversations = [...prev];
        newConversations[conversationIndex] = {
          ...newConversations[conversationIndex],
          lastMessage: message.content,
          updatedAt: new Date().toISOString(),
          unreadCount: selectedUserId === message.sender._id ? 0 : 
            (newConversations[conversationIndex].unreadCount || 0) + 1
        };

        return newConversations;
      });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedUserId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => {
        const otherParticipant = conversation.participants.find(p => p._id !== user._id);
        
        return (
          <div
            key={otherParticipant._id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedUserId === otherParticipant._id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectChat(otherParticipant._id)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  {otherParticipant.profileImage ? (
                    <img
                      src={otherParticipant.profileImage}
                      alt={otherParticipant.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl text-white">
                      {otherParticipant.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {otherParticipant.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {conversations.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No conversations yet
        </div>
      )}
    </div>
  );
}