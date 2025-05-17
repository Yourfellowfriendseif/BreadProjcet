import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { userAPI } from '../api/userAPI';
import { breadAPI } from '../api/breadAPI';
import { uploadAPI } from '../api/uploadAPI';
import BreadListing from './bread/BreadListing';
import LoadingSpinner from './LoadingSpinner';
import './UserProfile.css';

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useApp();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [avatar, setAvatar] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  const isOwnProfile = !userId || (currentUser && userId === currentUser._id);

  useEffect(() => {
    loadProfile();
  }, [userId, currentUser]);

  useEffect(() => {
    if (profileUser) {
      setEditForm({
        username: profileUser.username || '',
        email: profileUser.email || '',
        phone: profileUser.phone || ''
      });
    }
  }, [profileUser]);

  useEffect(() => {
    if (profileUser) {
      loadUserPosts(activeTab);
    }
  }, [profileUser, activeTab]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isOwnProfile) {
        console.log('Loading own profile with current user data:', currentUser);
        setProfileUser({
          ...currentUser,
          avatar: uploadAPI.getAvatarUrl(currentUser)
        });
      } else {
        const userData = await userAPI.getUserById(userId);
        console.log('Fetched user profile data:', userData);
        const user = userData.data || userData;
        
        setProfileUser({
          ...user,
          avatar: uploadAPI.getAvatarUrl(user)
        });
      }
    } catch (err) {
      console.error('Profile load error:', err);
      setError(err.message || 'Failed to load profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async (status) => {
    try {
      setLoading(true);
      const response = await breadAPI.getUserPosts(profileUser._id, { status });
      const postsData = response?.data?.data?.posts || response?.data?.posts || [];
      setPosts(postsData);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('photo', file);
      
      console.log('Uploading file:', file);
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const updatedUser = await userAPI.updateProfile(formData);
      console.log('Profile update response:', updatedUser);

      // Extract user data from response
      const userData = updatedUser?.data?.user || updatedUser?.data || updatedUser;
      console.log('Extracted user data:', userData);
      
      if (!userData) {
        throw new Error('No user data received from server');
      }

      const processedUser = {
        ...userData,
        avatar: uploadAPI.getAvatarUrl(userData)
      };
      
      console.log('Processed user with avatar:', processedUser);
      setProfileUser(processedUser);
      updateUser(processedUser);
      setUploadProgress(100);

      // Reload profile to ensure we have the latest data
      await loadProfile();
    } catch (err) {
      console.error('Avatar update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile picture. Please try again.');
      setUploadProgress(0);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    try {
      // Only include fields that have changed and are not empty
      const updates = {};
      if (editForm.username && editForm.username !== profileUser.username) {
        updates.username = editForm.username.trim();
      }
      if (editForm.email && editForm.email !== profileUser.email) {
        updates.email = editForm.email.trim();
      }
      if (editForm.phone !== profileUser.phone) {
        updates.phone = editForm.phone ? editForm.phone.trim() : '';
      }

      // Only proceed if there are actual changes
      if (Object.keys(updates).length === 0) {
        setUpdateError('No changes to update');
        return;
      }

      console.log('Current profile data:', profileUser);
      console.log('Submitting updates:', updates);
      
      const updatedUser = await userAPI.updateProfile(updates);
      console.log('Update response received:', updatedUser);

      if (!updatedUser.username && updatedUser.name) {
        updatedUser.username = updatedUser.name;
      }

      // Update local state with the new user data
      setProfileUser(prev => ({
        ...prev,
        ...updatedUser,
        // Ensure we use the correct field names
        username: updatedUser.username || updatedUser.name,
        phone: updatedUser.phone || updatedUser.phone_number,
        avatar: uploadAPI.getAvatarUrl(updatedUser)
      }));

      // Update global user state if it's the current user's profile
      if (isOwnProfile) {
        updateUser(prev => ({
          ...prev,
          ...updatedUser,
          // Ensure we use the correct field names
          username: updatedUser.username || updatedUser.name,
          phone: updatedUser.phone || updatedUser.phone_number,
          avatar: uploadAPI.getAvatarUrl(updatedUser)
        }));
      }

      setUpdateSuccess('Profile updated successfully!');
      
      // Reset form with new values
      setEditForm({
        username: updatedUser.username || updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || updatedUser.phone_number || ''
      });

      // Reload profile after a short delay to verify changes
      setTimeout(async () => {
        try {
          await loadProfile();
        } catch (err) {
          console.error('Failed to reload profile:', err);
        }
      }, 1000);

      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      console.error('Profile update error:', {
        error: err,
        message: err.message,
        response: err.response?.data
      });
      
      let errorMessage;
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message.includes('No user data received')) {
        errorMessage = 'Server error: Failed to get updated profile data';
      } else {
        errorMessage = 'Failed to update profile. Please try again.';
      }
      
      setUpdateError(errorMessage);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setUpdateError('New passwords do not match');
      return;
    }

    try {
      await userAPI.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setUpdateSuccess('Password updated successfully!');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update password');
    }
  };

  if (loading && !profileUser) {
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

  if (!profileUser) {
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
                src={profileUser.avatar}
                alt={profileUser.username}
                className="user-profile-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/no-image.png';
                }}
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
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="user-profile-upload-progress">
                  <div 
                    className="user-profile-upload-progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
            <div className="user-profile-details">
              <h1>{profileUser.username}</h1>
              <p className="user-profile-email">{profileUser.email}</p>
              {profileUser.phone && (
                <p className="user-profile-phone">{profileUser.phone}</p>
              )}
              <p className="user-profile-date">
                Member since {new Date(profileUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {isOwnProfile && (
            <button
              className="user-profile-edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          )}
        </div>

        {isOwnProfile && isEditing && (
          <div className="user-profile-edit-section">
            {(updateSuccess || updateError) && (
              <div className={`user-profile-message ${updateError ? 'error' : 'success'}`}>
                {updateError || updateSuccess}
              </div>
            )}
            
            <form onSubmit={handleEditSubmit} className="user-profile-form">
              <h2>Edit Profile Information</h2>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))}
                />
              </div>
              <button type="submit" className="user-profile-submit-button">
                Update Profile
              </button>
            </form>

            <form onSubmit={handlePasswordSubmit} className="user-profile-form">
              <h2>Change Password</h2>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  required
                />
              </div>
              <button type="submit" className="user-profile-submit-button">
                Update Password
              </button>
            </form>
          </div>
        )}

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