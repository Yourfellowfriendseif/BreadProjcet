import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

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
      className={`p-4 rounded-lg border ${
        notification.read ? 'bg-white' : 'bg-blue-50 border-blue-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <Link
              to={link}
              className="text-gray-900 hover:text-blue-600"
              onClick={() => !notification.read && onMarkAsRead(notification._id)}
            >
              <span className="font-medium">{notification.user.username}</span>
              {' '}{action}
            </Link>
            <span className="text-sm text-gray-500">{timeAgo}</span>
          </div>
          {notification.message && (
            <p className="text-gray-600 mt-1">{notification.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}