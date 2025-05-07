import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userAPI } from '../api/userAPI';
import { breadAPI } from '../api/breadAPI';
import BreadListing from './bread/BreadListing';
import LoadingSpinner from './LoadingSpinner';

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useApp();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [avatar, setAvatar] = useState(null);

  const isOwnProfile = !userId || (currentUser && userId === currentUser._id);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  useEffect(() => {
    if (user) {
      loadUserPosts(activeTab);
    }
  }, [user, activeTab]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = isOwnProfile 
        ? await userAPI.getProfile()
        : await userAPI.getUserById(userId);
      setUser(userData);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async (status) => {
    try {
      setLoading(true);
      const posts = await breadAPI.getUserPosts(user._id, status);
      setPosts(posts || []);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setAvatar(file);
        const formData = new FormData();
        formData.append('avatar', file);
        
        const updatedUser = await userAPI.updateProfile(formData);
        setUser(updatedUser);
        updateUser(updatedUser);
      } catch (err) {
        setError(err.message || 'Failed to update avatar');
      }
    }
  };

  if (loading && !user) {
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

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover"
              />
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-gray-500">{user.email}</p>
              {user.phone && (
                <p className="text-gray-500">{user.phone}</p>
              )}
              <p className="text-sm text-gray-400">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t">
          <div className="flex">
            <button
              className={`flex-1 py-3 px-4 text-center ${
                activeTab === 'active'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active Posts
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center ${
                activeTab === 'completed'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed Posts
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <BreadListing
                  key={post._id}
                  post={post}
                  onUpdate={() => loadUserPosts(activeTab)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}