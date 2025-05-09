import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import './NotificationMessage.css';

export default function NotificationMessage({ notification, onMarkAsRead }) {
  const getNotificationContent = () => {
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

  const { icon, link, action } = getNotificationContent();
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  return (
    <div
      className={`notification-message ${!notification.read ? 'notification-message-unread' : ''}`}
    >
      <div className="notification-message-content">
        <span className="notification-message-icon">{icon}</span>
        <div className="notification-message-details">
          <div className="notification-message-header">
            <Link
              to={link}
              className="notification-message-link"
              onClick={() => !notification.read && onMarkAsRead(notification._id)}
            >
              <span className="notification-message-username">{notification.user.username}</span>
              {' '}{action}
            </Link>
            <span className="notification-message-time">{timeAgo}</span>
          </div>
          {notification.message && (
            <p className="notification-message-text">{notification.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}