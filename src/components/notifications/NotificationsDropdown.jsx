import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { notificationAPI } from "../../api/notificationAPI";
import { socketService } from "../../api/socketService";
import { useApp } from "../../context/AppContext";
import NotificationMessage from "./NotificationMessage";
import LoadingSpinner from "../LoadingSpinner";
import "./NotificationsDropdown.css";

export default function NotificationsDropdown() {
  const { user } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }

    // Setup socket listeners for real-time notifications
    socketService.onNewNotification((notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 5));
    });

    socketService.onNotificationRead((notificationId) => {
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications();
      const data = response?.data?.data || response?.data || response;
      const fetchedNotifications = data?.notifications || [];
      setNotifications(fetchedNotifications.slice(0, 5));
    } catch (error) {
      console.error("Error loading notifications:", error);
      setError(error.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      socketService.markNotificationRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      socketService.markAllNotificationsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notifications-dropdown-button"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="notifications-dropdown-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown-menu">
          <div className="notifications-dropdown-header">
            <h3 className="notifications-dropdown-title">Notifications</h3>
            <div className="notifications-dropdown-actions">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="notifications-dropdown-mark-all"
                >
                  Mark all as read
                </button>
              )}
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
                <LoadingSpinner size="small" />
              </div>
            ) : error ? (
              <div className="notifications-dropdown-error">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="notifications-dropdown-empty">
                <span className="material-symbols-outlined">notifications_off</span>
                <p>No notifications</p>
              </div>
            ) : (
              <div className="notifications-dropdown-list">
                {notifications.map(notification => (
                  <NotificationMessage
                    key={notification._id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
