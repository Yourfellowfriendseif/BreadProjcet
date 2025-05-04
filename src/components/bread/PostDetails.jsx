import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { breadAPI } from '../../api/breadAPI';
import LoadingSpinner from '../LoadingSpinner';
import ChatWindow from '../chat/ChatWindow';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await breadAPI.getById(id);
      setPost(response.data);
    } catch (error) {
      setError(error.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    try {
      setLoading(true);
      await breadAPI.reserve(id);
      loadPost();
    } catch (error) {
      setError(error.message || 'Failed to reserve post');
    } finally {
      setLoading(false);
    }
  };

  const handleUnreserve = async () => {
    try {
      setLoading(true);
      await breadAPI.unreserve(id);
      loadPost();
    } catch (error) {
      setError(error.message || 'Failed to unreserve post');
    } finally {
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
      <div className="text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-500 hover:text-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Post not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-500 hover:text-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:text-blue-600 flex items-center"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.images && post.images.length > 0 && (
          <div>
            <div className="relative h-96">
              <img
                src={post.images[selectedImage]}
                alt={post.description}
                className="w-full h-full object-contain"
              />
              {post.images.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 flex justify-center p-4 space-x-2">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === selectedImage ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            {post.images.length > 1 && (
              <div className="flex overflow-x-auto p-2 space-x-2">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className={`h-20 w-20 object-cover cursor-pointer rounded-md ${
                      index === selectedImage ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                post.status === 'fresh' ? 'bg-green-100 text-green-800' :
                post.status === 'day_old' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {post.status}
              </span>
              <span className="ml-2 text-gray-500">
                {post.post_type === 'sell' ? 'For Sale' : 'Request'}
              </span>
            </div>
            <p className="text-gray-500">
              Posted {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>

          <p className="text-xl font-semibold mb-2">
            {post.quantity} {post.quantity_unit}
          </p>
          <p className="text-gray-600 mb-6">{post.description}</p>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-4">
              <img
                src={post.user.photo_url || '/default-avatar.png'}
                alt={post.user.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{post.user.username}</p>
                {post.distance && (
                  <p className="text-sm text-gray-500">
                    {(post.distance / 1000).toFixed(1)}km away
                  </p>
                )}
              </div>
            </div>

            {user && user._id !== post.user._id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowChat(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Message
                </button>
                {post.post_type === 'sell' && !post.reserved && (
                  <button
                    onClick={handleReserve}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    Reserve
                  </button>
                )}
                {post.reserved && post.reserved_by === user._id && (
                  <button
                    onClick={handleUnreserve}
                    disabled={loading}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>
            )}
          </div>

          {post.reserved && post.reserved_by !== user?._id && (
            <p className="mt-4 text-yellow-600 text-center">
              This item has been reserved
            </p>
          )}
        </div>
      </div>

      {showChat && (
        <ChatWindow
          recipientId={post.user._id}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}