import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BreadItem.css';

const fallbackImg = '/no-image.png'; // Use a default image in your public folder

const statusLabels = {
  fresh: { label: 'Fresh', className: 'bread-badge-fresh' },
  day_old: { label: 'Day Old', className: 'bread-badge-day-old' },
  stale: { label: 'Stale', className: 'bread-badge-stale' },
};

const typeLabels = {
  sell: { label: 'For Sale', className: 'bread-badge-sell' },
  request: { label: 'Request', className: 'bread-badge-request' },
};

const BreadItem = ({ post, onUpdate }) => {
  const navigate = useNavigate();
  const imageUrl = post.images && post.images.length > 0
    ? (post.images[0].url || post.images[0])
    : fallbackImg;

  const handleMessageClick = () => {
    if (post.user?._id) {
      navigate(`/messages?userId=${post.user._id}`);
    }
  };

  return (
    <div className="bread-card">
      <div className="bread-card-image-wrapper">
        <img
          src={imageUrl}
          alt={post.description?.slice(0, 30) || 'Bread post'}
          className="bread-card-image"
          onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
        />
      </div>
      <div className="bread-card-content">
        <div className="bread-card-badges-row">
          {post.price && (
            <span className="bread-card-price">${parseFloat(post.price).toFixed(2)}</span>
          )}
          <span className={`bread-card-badge ${statusLabels[post.status]?.className || ''}`}>
            {statusLabels[post.status]?.label || post.status}
          </span>
          <span className={`bread-card-badge ${typeLabels[post.post_type]?.className || ''}`}>
            {typeLabels[post.post_type]?.label || post.post_type}
          </span>
        </div>
        <h3 className="bread-card-title">{post.title || (post.post_type === 'sell' ? 'Bread for Sale' : 'Bread Request')}</h3>
        <p className="bread-card-description">{post.description}</p>
        <div className="bread-card-qty-loc">
          <span className="bread-card-quantity">
            {post.quantity} {post.quantity_unit}
          </span>
          {post.address && <span className="bread-card-address">{post.address}</span>}
        </div>
        <div className="bread-card-footer">
          <div className="bread-card-user">
            <img
              src={post.user?.photo_url || '/default-avatar.png'}
              alt={post.user?.username || 'User'}
              className="bread-card-avatar"
            />
            <span className="bread-card-username">{post.user?.username || 'Anonymous'}</span>
          </div>
          <span className="bread-card-date">
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
          </span>
        </div>
        <div className="bread-card-actions">
          <button className="bread-card-btn bread-card-btn-outline" onClick={handleMessageClick}>Message</button>
          <button className="bread-card-btn bread-card-btn-primary" onClick={() => onUpdate && onUpdate('viewDetails', post)}>View Details</button>
        </div>
      </div>
    </div>
  );
};

export default BreadItem;