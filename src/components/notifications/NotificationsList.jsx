import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationAPI } from '../../api/notificationAPI';
import { socketService } from '../../api/socketService';
import LoadingSpinner from '../LoadingSpinner';

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotifications();
    setupSocketListeners();

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const setupSocketListeners = () => {
    socketService.onNotification((notification) => {
      setNotifications(prev => [notification, ...prev]);
    });
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      setError(error.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      setNotifications(prev =>
        prev.filter(n => n._id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'post_reserved':
      case 'reservation_cancelled':
        return `/posts/${notification.post?._id}`;
      case 'new_message':
        return `/messages?userId=${notification.user}`;
      default:
        return '#';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-700">
          No Notifications
        </h2>
        <p className="mt-2 text-gray-500">
          You're all caught up!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-xl font-semibold text-gray-700">
          Notifications
        </h2>
        <button
          onClick={handleMarkAllAsRead}
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 rounded-lg ${
              notification.read ? 'bg-white' : 'bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <Link
                to={getNotificationLink(notification)}
                className="flex-1"
                onClick={() => !notification.read && handleMarkAsRead(notification._id)}
              >
                <p className={`text-gray-800 ${!notification.read && 'font-medium'}`}>
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </Link>

              <button
                onClick={() => handleDelete(notification._id)}
                className="ml-4 text-gray-400 hover:text-red-500"
              >
                <svg
                  className="w-5 h-5"
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
          </div>
        ))}
      </div>
    </div>
  );
}