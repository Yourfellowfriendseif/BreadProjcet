export default function Avatar({
  src,
  alt,
  size = 'md',
  className = ''
}) {
  const sizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-24 w-24'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!src) {
    return (
      <div
        className={`${sizes[size]} ${className} inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600`}
      >
        <span className={`font-medium ${size === 'xs' ? 'text-xs' : 'text-sm'}`}>
          {getInitials(alt)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} ${className} rounded-full object-cover`}
    />
  );
}