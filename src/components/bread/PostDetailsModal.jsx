import React, { useEffect, useRef } from 'react';
import './PostDetailsModal.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

  const images = post.images && post.images.length > 0 ? post.images : [{ url: fallbackImg }];

  return (
    <div className="post-modal-backdrop" ref={modalRef} onClick={handleBackdropClick}>
      <div className="post-modal-card">
        <button className="post-modal-close" onClick={onClose}>&times;</button>
        <div className="post-modal-image-wrapper">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={images.length > 1}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={img._id || idx}>
                <img
                  src={img.url || (img.filename ? `/uploads/${img.filename}` : fallbackImg)}
                  alt={post.title || 'Bread post'}
                  className="post-modal-image"
                  onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
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