const variants = {
  fresh: 'bg-green-100 text-green-800',
  day_old: 'bg-yellow-100 text-yellow-800',
  stale: 'bg-red-100 text-red-800',
  reserved: 'bg-blue-100 text-blue-800',
  completed: 'bg-purple-100 text-purple-800',
  default: 'bg-gray-100 text-gray-800'
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base'
};

export default function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = ''
}) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full
        ${variants[variant] || variants.default}
        ${sizes[size]}
        ${className}`}
    >
      {children}
    </span>
  );
}