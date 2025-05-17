import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useApp();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('Username, email and password are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // If we have an avatar, use FormData
      if (avatar) {
        const userData = new FormData();
        userData.append('username', formData.username);
        userData.append('email', formData.email);
        userData.append('password', formData.password);
        if (formData.phone) userData.append('phone', formData.phone);
        if (formData.address) userData.append('address', formData.address);
        userData.append('avatar', avatar);

        const response = await register(userData);
        if (response?.token) {
          navigate('/');
        }
      } else {
        // If no avatar, send regular JSON
        const response = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          address: formData.address || undefined
        });
        
        if (response?.token) {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Failed to register';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <div className="register-header">
          <h1 className="register-title">Create your account</h1>
          <p className="register-subtitle">
            Already have an account?{' '}
            <a href="/login" className="register-link">
              Sign in
            </a>
          </p>
        </div>

        {error && (
          <div className="register-error">
            <p className="register-error-text">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-avatar-section">
            <div className="register-avatar-container">
              <img
                src={avatarPreview || '/default-avatar.png'}
                alt="Profile preview"
                className="register-avatar-preview"
              />
              <label className="register-avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="register-avatar-input"
                />
                <span className="register-avatar-upload-text">
                  {avatar ? 'Change Photo' : 'Add Photo'}
                </span>
              </label>
            </div>
          </div>

          <div className="register-input-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="register-input"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="register-input"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="register-input"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="register-input"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="register-input"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="register-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="register-submit"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;