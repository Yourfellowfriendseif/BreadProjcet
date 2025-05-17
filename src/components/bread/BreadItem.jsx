import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BreadItem.css';
import { AppContext } from '../../context/AppContext';
import breadAPI from '../../api/breadAPI';

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

const BreadItem = ({ post, onUpdate, onReserve, onDelete, onEdit, hideReserveButton }) => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const isOwner = user && post.user && user._id === post.user._id;
  const [error, setError] = useState(null);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      setIsDescriptionTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [post.description]);

  const handleMessageClick = () => {
    if (post.user?._id) {
      navigate(`/messages/${post.user._id}`);
    }
  };

  const handleReserve = async () => {
    if (post.is_reserved) {
      setError('This post has already been reserved');
      return;
    }

    setReserveLoading(true);
    setError(null);
    
    try {
      await breadAPI.reservePost(post._id);
      if (onReserve) {
        onReserve({ ...post, is_reserved: true, reserved_by: user });
      }
    } catch (err) {
      if (err.response?.data?.message === 'Post already reserved') {
        setError('This post has just been reserved by someone else');
        // Refresh the post data
        if (onUpdate) {
          onUpdate('refresh', post);
        }
      } else {
        setError(err.message || 'Failed to reserve post');
      }
    } finally {
      setReserveLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    setReserveLoading(true);
    setError(null);
    
    try {
      await breadAPI.cancelReservation(post._id);
      if (onReserve) {
        onReserve({ ...post, is_reserved: false, reserved_by: null });
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel reservation');
    } finally {
      setReserveLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/posts/edit/${post._id}`);
    if (onEdit) onEdit(post);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      if (onDelete) onDelete(post);
    }
  };

  const handleViewMore = () => {
    if (onUpdate) {
      onUpdate('viewDetails', post);
    }
  };

  // Dynamic grid logic
  const images = post.images && post.images.length > 0 ? post.images.slice(0, 5) : [];
  const imageCount = images.length;
  let gridClass = 'bread-card-image-grid';
  if (imageCount === 1) gridClass += ' grid-1';
  else if (imageCount === 2) gridClass += ' grid-2';
  else if (imageCount === 3 || imageCount === 4) gridClass += ' grid-4';
  else if (imageCount >= 5) gridClass += ' grid-6';

  return (
    <div className="bread-card">
      <div className="bread-card-image-wrapper">
        <div className={gridClass}>
          {imageCount > 0 ? (
            images.map((img, idx) => (
              <div className="bread-card-image-thumb" key={img._id || idx}>
        <img
                  src={img.url || (img.filename ? `/uploads/${img.filename}` : fallbackImg)}
          alt={post.description?.slice(0, 30) || 'Bread post'}
          className="bread-card-image"
          onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
        />
                {/* Overlay for the last image if there are more than 5 */}
                {idx === 4 && post.images.length > 5 && (
                  <div className="bread-card-image-overlay">
                    +{post.images.length - 5}
                  </div>
                )}
              </div>
            ))
          ) : (
            <img
              src={fallbackImg}
              alt="No image"
              className="bread-card-image"
            />
          )}
        </div>
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
        <div style={{ position: 'relative' }}>
          <p 
            ref={descriptionRef}
            className="bread-card-description"
          >
            {post.description}
          </p>
          {isDescriptionTruncated && (
            <button 
              className="bread-card-view-more"
              onClick={handleViewMore}
            >
              ... view more
            </button>
          )}
        </div>
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
        {error && (
          <div className="bread-card-error">
            <span className="material-symbols-outlined">error</span>
            <p>{error}</p>
          </div>
        )}
        <div className="bread-card-actions">
          {isOwner ? (
            <>
              <button className="bread-card-btn bread-card-btn-outline" onClick={handleEdit}>Edit</button>
              <button className="bread-card-btn bread-card-btn-danger" onClick={handleDelete}>Delete</button>
            </>
          ) : (
            <>
          <button className="bread-card-btn bread-card-btn-outline" onClick={handleMessageClick}>Message</button>
          <button className="bread-card-btn bread-card-btn-primary" onClick={() => onUpdate && onUpdate('viewDetails', post)}>View Details</button>
              {!hideReserveButton && (
                post.is_reserved ? (
                  post.reserved_by?._id === user?._id ? (
                    <button
                      className="bread-card-btn bread-card-btn-cancel"
                      onClick={handleCancelReservation}
                      disabled={reserveLoading}
                    >
                      {reserveLoading ? 'Canceling...' : 'Cancel Reservation'}
                    </button>
                  ) : (
                    <div className="bread-card-reserved">
                      <span className="material-symbols-outlined">lock</span>
                      Reserved
                    </div>
                  )
                ) : (
                  <button
                    className="bread-card-btn bread-card-btn-reserve"
                    onClick={handleReserve}
                    disabled={reserveLoading || post.is_reserved}
                  >
                    {reserveLoading ? 'Reserving...' : 'Reserve'}
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreadItem;