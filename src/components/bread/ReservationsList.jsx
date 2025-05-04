import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { breadAPI } from '../../api/breadAPI';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../LoadingSpinner';

export default function ReservationsList() {
  const { user } = useApp();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await breadAPI.getReservedPosts();
      setReservations(response.data);
    } catch (error) {
      setError(error.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (postId) => {
    try {
      await breadAPI.unreserve(postId);
      setReservations(prev => prev.filter(r => r._id !== postId));
    } catch (error) {
      console.error('Error cancelling reservation:', error);
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
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-700">No Reservations</h2>
        <p className="mt-2 text-gray-500">
          You haven't reserved any bread posts yet
        </p>
        <Link
          to="/bread"
          className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Browse Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">Your Reservations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {post.images && post.images.length > 0 && (
              <img
                src={post.images[0]}
                alt={post.description}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {post.status} Bread
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {post.quantity} {post.quantity_unit}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  post.post_type === 'sell'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {post.post_type === 'sell' ? 'For Sale' : 'Request'}
                </span>
              </div>

              <p className="mt-2 text-gray-600">{post.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  to={`/user/${post.user._id}`}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <img
                    src={post.user.photo_url || '/default-avatar.png'}
                    alt={post.user.username}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span>{post.user.username}</span>
                </Link>
                <button
                  onClick={() => handleCancelReservation(post._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Cancel Reservation
                </button>
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  to={`/posts/${post._id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}