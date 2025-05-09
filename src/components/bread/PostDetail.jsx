import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { breadAPI } from '../../api/breadAPI';
import LoadingSpinner from '../LoadingSpinner';
import './PostDetail.css';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await breadAPI.getPostById(id);
      setPost(response);
    } catch (err) {
      setError(err.message || 'Failed to load post details');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    try {
      setIsReserving(true);
      setError(null);
      await breadAPI.reservePost(id);
      loadPost();
    } catch (err) {
      setError(err.message || 'Failed to reserve bread');
    } finally {
      setIsReserving(false);
    }
  };

  const handleCancelReservation = async () => {
    try {
      setIsReserving(true);
      setError(null);
      await breadAPI.cancelReservation(id);
      loadPost();
    } catch (err) {
      setError(err.message || 'Failed to cancel reservation');
    } finally {
      setIsReserving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await breadAPI.deletePost(id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="post-detail-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detail-error-container">
        <div className="post-detail-error">
          <p className="post-detail-error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-not-found">
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-card">
        {post.images && post.images.length > 0 && (
          <div className="post-detail-image-container">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${post.images[0]}`}
              alt={post.title}
              className="post-detail-image"
            />
          </div>
        )}

        <div className="post-detail-content">
          <div className="post-detail-header">
            <div>
              <h1 className="post-detail-title">{post.title}</h1>
              <div className="post-detail-badges">
                <span className={`post-detail-badge ${
                  post.status === 'fresh' ? 'post-detail-badge-fresh' :
                  post.status === 'day_old' ? 'post-detail-badge-day-old' :
                  'post-detail-badge-stale'
                }`}>
                  {post.status.replace('_', ' ')}
                </span>
                <span className={`post-detail-badge ${
                  post.type === 'offer' ? 'post-detail-badge-offer' : 'post-detail-badge-request'
                }`}>
                  {post.type === 'offer' ? 'Offering' : 'Requesting'}
                </span>
              </div>
            </div>

            {user && user._id === post.user._id && (
              <div className="post-detail-actions">
                <button
                  onClick={() => navigate(`/bread/${id}/edit`)}
                  className="post-detail-button post-detail-button-edit"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="post-detail-button post-detail-button-delete"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <p className="post-detail-description">{post.description}</p>

          <div className="post-detail-info-grid">
            <div>
              <h3 className="post-detail-info-label">Quantity</h3>
              <p className="post-detail-info-value">
                {post.quantity} {post.quantity_unit}
              </p>
            </div>
            {post.address && (
              <div>
                <h3 className="post-detail-info-label">Location</h3>
                <p className="post-detail-info-value">{post.address}</p>
              </div>
            )}
          </div>

          <div className="post-detail-user">
            <img
              src={post.user.avatar || '/default-avatar.png'}
              alt={post.user.username}
              className="post-detail-avatar"
            />
            <div>
              <p className="post-detail-username">{post.user.username}</p>
              <p className="post-detail-date">
                Posted {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {error && (
            <div className="post-detail-error">
              <p className="post-detail-error-text">{error}</p>
            </div>
          )}

          {user && user._id !== post.user._id && !post.is_completed && (
            <div className="post-detail-reserve">
              {post.is_reserved ? (
                post.reserved_by?._id === user._id && (
                  <button
                    onClick={handleCancelReservation}
                    disabled={isReserving}
                    className="post-detail-reserve-button post-detail-reserve-button-danger"
                  >
                    {isReserving ? 'Canceling...' : 'Cancel Reservation'}
                  </button>
                )
              ) : (
                <button
                  onClick={handleReserve}
                  disabled={isReserving}
                  className="post-detail-reserve-button post-detail-reserve-button-primary"
                >
                  {isReserving ? 'Reserving...' : 'Reserve'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}