import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import NotificationsList from './notifications/NotificationsList';
import ChatWindow from './chat/ChatWindow';
import SearchBar from './search/SearchBar';

export default function NavBar() {
  const { user, notifications, unreadMessages } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              BreadProject
            </Link>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="flex-grow max-w-xl">
                <SearchBar />
              </div>

              <Link
                to="/reservations"
                className="text-gray-600 hover:text-gray-800"
              >
                Reservations
              </Link>

              <Link
                to="/messages"
                className="relative text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadMessages}
                  </span>
                )}
              </Link>

              {/* Notification Bell */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <img
                  src={user.photo_url || '/default-avatar.png'}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span>{user.username}</span>
              </Link>

              <Link
                to="/bread/new"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Post
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 mt-2 w-80 z-50">
          <NotificationsList />
        </div>
      )}

      {/* Chat Window */}
      {showChat && activeChatUser && (
        <ChatWindow
          recipientId={activeChatUser}
          onClose={() => {
            setShowChat(false);
            setActiveChatUser(null);
          }}
        />
      )}
    </nav>
  );
}