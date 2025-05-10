import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { notificationAPI } from "../../api/notificationAPI";
import LoadingSpinner from "../LoadingSpinner";
import "./NotificationsList.css";

export default function NotificationsList() {
  const {
    notifications: contextNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load notifications when component mounts
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationAPI.getNotifications();
        const data = response?.data?.data || response?.data || response;
        const fetchedNotifications = data?.notifications || [];

        console.log("Fetched notifications:", fetchedNotifications);
        setNotifications(fetchedNotifications);
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Keep local notifications in sync with context notifications
  useEffect(() => {
    if (contextNotifications.length > 0) {
      setNotifications(contextNotifications);
    }
  }, [contextNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      // Immediately update the UI
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError(err.message || "Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      // Immediately update the UI
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setError(err.message || "Failed to mark all notifications as read");
    }
  };

  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case "post_reserved":
        return {
          icon: "🔒",
          link: `/bread/${notification.post?._id}`,
          action: "reserved your post",
        };
      case "reservation_cancelled":
        return {
          icon: "🔓",
          link: `/bread/${notification.post?._id}`,
          action: "cancelled their reservation",
        };
      case "new_message":
        return {
          icon: "💬",
          link: "/messages",
          action: "sent you a message",
        };
      case "post_completed":
        return {
          icon: "✅",
          link: `/bread/${notification.post?._id}`,
          action: "marked the exchange as completed",
        };
      default:
        return {
          icon: "📢",
          link: "#",
          action: "interacted with your post",
        };
    }
  };

  if (loading) {
    return (
      <div className="notifications-list-loading">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="notifications-list">
      <div className="notifications-list-header">
        <h2 className="notifications-list-title">Notifications</h2>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="notifications-list-mark-all"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="notifications-list-error">
          <p className="notifications-list-error-text">{error}</p>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="notifications-list-empty">No notifications yet</div>
      ) : (
        <div className="notifications-list-items">
          {notifications.map((notification) => {
            const { icon, link, action } = getNotificationContent(notification);

            return (
              <div
                key={notification._id}
                className={`notification-item ${
                  !notification.read ? "notification-item-unread" : ""
                }`}
              >
                <div className="notification-item-content">
                  <span className="notification-item-icon">{icon}</span>
                  <div className="notification-item-details">
                    <div className="notification-item-header">
                      <Link
                        to={link}
                        className="notification-item-link"
                        onClick={() =>
                          !notification.read &&
                          handleMarkAsRead(notification._id)
                        }
                      >
                        <span className="notification-item-username">
                          {(notification.user && notification.user.username) ||
                            "Unknown user"}
                        </span>{" "}
                        {action}
                      </Link>
                      <span className="notification-item-date">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {notification.message && (
                      <p className="notification-item-message">
                        {notification.message}
                      </p>
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
