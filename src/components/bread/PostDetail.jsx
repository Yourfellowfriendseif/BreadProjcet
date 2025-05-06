import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { breadAPI } from '../../api/breadAPI';
import LoadingSpinner from '../LoadingSpinner';

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
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {post.images && post.images.length > 0 && (
          <div className="relative h-96">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${post.images[0]}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className={`px-2 py-1 rounded ${
                  post.status === 'fresh' ? 'bg-green-100 text-green-800' :
                  post.status === 'day_old' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {post.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded ${
                  post.type === 'offer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {post.type === 'offer' ? 'Offering' : 'Requesting'}
                </span>
              </div>
            </div>

            {user && user._id === post.user._id && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/bread/${id}/edit`)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-6">{post.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
              <p className="mt-1">
                {post.quantity} {post.quantity_unit}
              </p>
            </div>
            {post.address && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1">{post.address}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <img
              src={post.user.avatar || '/default-avatar.png'}
              alt={post.user.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{post.user.username}</p>
              <p className="text-sm text-gray-500">
                Posted {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {user && user._id !== post.user._id && !post.is_completed && (
            <div className="flex justify-end">
              {post.is_reserved ? (
                post.reserved_by?._id === user._id && (
                  <button
                    onClick={handleCancelReservation}
                    disabled={isReserving}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    {isReserving ? 'Canceling...' : 'Cancel Reservation'}
                  </button>
                )
              ) : (
                <button
                  onClick={handleReserve}
                  disabled={isReserving}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
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