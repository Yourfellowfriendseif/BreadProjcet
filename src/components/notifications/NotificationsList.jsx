import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { notificationAPI } from '../../api/notificationAPI';
import LoadingSpinner from '../LoadingSpinner';

export default function NotificationsList() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
    }
  };

  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case 'post_reserved':
        return {
          icon: '🔒',
          link: `/bread/${notification.post?._id}`,
          action: 'reserved your post'
        };
      case 'reservation_cancelled':
        return {
          icon: '🔓',
          link: `/bread/${notification.post?._id}`,
          action: 'cancelled their reservation'
        };
      case 'new_message':
        return {
          icon: '💬',
          link: '/messages',
          action: 'sent you a message'
        };
      case 'post_completed':
        return {
          icon: '✅',
          link: `/bread/${notification.post?._id}`,
          action: 'marked the exchange as completed'
        };
      default:
        return {
          icon: '📢',
          link: '#',
          action: 'interacted with your post'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No notifications yet
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const { icon, link, action } = getNotificationContent(notification);
            
            return (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border ${
                  notification.read 
                    ? 'bg-white'
                    : 'bg-blue-50 border-blue-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <Link
                        to={link}
                        className="text-gray-900 hover:text-blue-600"
                        onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                      >
                        <span className="font-medium">{notification.user.username}</span>
                        {' '}{action}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {notification.message && (
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}