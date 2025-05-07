import { formatDistanceToNow } from 'date-fns';

export default function TimeAgo({ date, className = '' }) {
  if (!date) return null;

  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });

  return (
    <time dateTime={date} className={`text-gray-500 ${className}`}>
      {timeAgo}
    </time>
  );
}