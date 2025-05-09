import React, { useEffect, useRef } from 'react';
import './PostDetailsModal.css';

const fallbackImg = '/no-image.png';

export default function PostDetailsModal({ post, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  return (
    <div className="post-modal-backdrop" ref={modalRef} onClick={handleBackdropClick}>
      <div className="post-modal-card">
        <button className="post-modal-close" onClick={onClose}>&times;</button>
        <div className="post-modal-image-wrapper">
          <img
            src={post.images && post.images.length > 0 ? (post.images[0].url || post.images[0]) : fallbackImg}
            alt={post.title || 'Bread post'}
            className="post-modal-image"
            onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
          />
        </div>
        <div className="post-modal-content">
          <h2 className="post-modal-title">{post.title || (post.post_type === 'sell' ? 'Bread for Sale' : 'Bread Request')}</h2>
          <div className="post-modal-badges">
            <span className="post-modal-badge post-modal-badge-type">{post.post_type === 'sell' ? 'For Sale' : 'Request'}</span>
            <span className={`post-modal-badge post-modal-badge-status post-modal-badge-${post.status}`}>{post.status}</span>
            {post.price && <span className="post-modal-badge post-modal-badge-price">${parseFloat(post.price).toFixed(2)}</span>}
          </div>
          <p className="post-modal-description">{post.description}</p>
          <div className="post-modal-info">
            <div><strong>Quantity:</strong> {post.quantity} {post.quantity_unit}</div>
            {post.address && <div><strong>Location:</strong> {post.address}</div>}
            <div><strong>Posted:</strong> {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</div>
          </div>
          <div className="post-modal-user">
            <img
              src={post.user?.photo_url || '/default-avatar.png'}
              alt={post.user?.username || 'User'}
              className="post-modal-avatar"
            />
            <span className="post-modal-username">{post.user?.username || 'Anonymous'}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 