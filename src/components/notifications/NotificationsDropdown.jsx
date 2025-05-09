import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { notificationAPI } from '../../api/notificationAPI';
import { socketService } from '../../api/socketService';
import LoadingSpinner from '../LoadingSpinner';
import './NotificationsDropdown.css';

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
    setupSocketListeners();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      socketService.removeAllListeners();
    };
  }, [isOpen]);

  const setupSocketListeners = () => {
    socketService.onNotification((notification) => {
      setNotifications(prev => [notification, ...prev]);
    });
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications({ limit: 5 });
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notifications-dropdown-button"
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
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="notifications-dropdown-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown-menu">
          <div className="notifications-dropdown-header">
            <div className="notifications-dropdown-header-content">
              <h3 className="notifications-dropdown-title">Notifications</h3>
              <Link
                to="/notifications"
                className="notifications-dropdown-view-all"
                onClick={() => setIsOpen(false)}
              >
                View All
              </Link>
            </div>
          </div>

          <div className="notifications-dropdown-content">
            {loading ? (
              <div className="notifications-dropdown-loading">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="notifications-dropdown-error">
                {error}
              </div>
            ) : notifications.length === 0 ? (
              <div className="notifications-dropdown-empty">
                No notifications
              </div>
            ) : (
              <div className="notifications-dropdown-list">
                {notifications.map((notification) => (
                  <Link
                    key={notification._id}
                    to={getNotificationLink(notification)}
                    className={`notifications-dropdown-item ${
                      !notification.read ? 'notifications-dropdown-item-unread' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification._id);
                      }
                      setIsOpen(false);
                    }}
                  >
                    <p className={`notifications-dropdown-item-text ${
                      !notification.read ? 'notifications-dropdown-item-text-unread' : ''
                    }`}>
                      {notification.message}
                    </p>
                    <p className="notifications-dropdown-item-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}