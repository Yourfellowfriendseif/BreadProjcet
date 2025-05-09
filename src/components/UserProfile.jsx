import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userAPI } from '../api/userAPI';
import { breadAPI } from '../api/breadAPI';
import BreadListing from './bread/BreadListing';
import LoadingSpinner from './LoadingSpinner';
import './UserProfile.css';

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
      <div className="user-profile-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-error">
        <div className="user-profile-error-content">
          <p className="user-profile-error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-not-found">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="user-profile-container">
        <div className="user-profile-header">
          <div className="user-profile-info">
            <div className="user-profile-avatar-container">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="user-profile-avatar"
              />
              {isOwnProfile && (
                <label className="user-profile-avatar-upload">
                  <input
                    type="file"
                    className="user-profile-avatar-input"
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
            <div className="user-profile-details">
              <h1>{user.username}</h1>
              <p className="user-profile-email">{user.email}</p>
              {user.phone && (
                <p className="user-profile-phone">{user.phone}</p>
              )}
              <p className="user-profile-date">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="user-profile-tabs">
          <div className="user-profile-tab-container">
            <button
              className={`user-profile-tab ${
                activeTab === 'active' ? 'user-profile-tab-active' : ''
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active Posts
            </button>
            <button
              className={`user-profile-tab ${
                activeTab === 'completed' ? 'user-profile-tab-active' : ''
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed Posts
            </button>
          </div>
        </div>

        <div className="user-profile-content">
          {loading ? (
            <div className="user-profile-posts-loading">
              <LoadingSpinner />
            </div>
          ) : posts.length === 0 ? (
            <p className="user-profile-no-posts">No posts found</p>
          ) : (
            <div className="user-profile-posts-grid">
              <BreadListing posts={posts} onUpdate={() => loadUserPosts(activeTab)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}