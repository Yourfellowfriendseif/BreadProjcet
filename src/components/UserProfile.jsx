import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI } from '../api/userAPI';
import { breadAPI } from '../api/breadAPI';
import ChatWindow from './chat/ChatWindow';
import LoadingSpinner from './LoadingSpinner';

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = userId ? 
        await userAPI.getUserById(userId) :
        await userAPI.getProfile();
      setUser(userData);

      const posts = await breadAPI.getByUser(userData._id);
      setUserPosts(posts.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await breadAPI.uploadImage(file);
      if (response.data?.image) {
        await userAPI.updateProfile({
          ...user,
          photo_url: response.data.image
        });
        setUser(prev => ({
          ...prev,
          photo_url: response.data.image
        }));
      }
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setUpdating(false);
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
      <div className="text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-500">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <img
              src={user.photo_url || '/default-avatar.png'}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover"
            />
            {!userId && (
              <div className="absolute bottom-0 right-0">
                <label className="cursor-pointer bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={updating}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
                {user.phone_number && (
                  <p className="text-gray-600">{user.phone_number}</p>
                )}
              </div>
              {userId && userId !== user._id && (
                <button
                  onClick={() => setShowChat(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Message
                </button>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Posts</h2>
              {userPosts.length === 0 ? (
                <p className="text-gray-500">No posts yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPosts.map((post) => (
                    <div
                      key={post._id}
                      className="border rounded-lg p-4"
                    >
                      {post.images && post.images[0] && (
                        <img
                          src={post.images[0]}
                          alt={post.description}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            post.status === 'fresh' ? 'bg-green-100 text-green-800' :
                            post.status === 'day_old' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{post.description}</p>
                        <p className="mt-2 font-semibold">
                          {post.quantity} {post.quantity_unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showChat && (
        <ChatWindow
          recipientId={userId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}