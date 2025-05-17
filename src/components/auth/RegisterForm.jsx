import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { uploadAPI } from '../../api/uploadAPI';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useApp();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    address: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      if (photoUrl) {
        console.log('photoUrl', photoUrl);
        const filename = photoUrl.split('/').pop();
        console.log('filename', filename);
        await uploadAPI.deleteImage(filename);
      }

      const response = await uploadAPI.uploadSingleImage(file);
      const uploadedPhotoUrl = response.data.url;

      setPhoto(file);
      setPhotoUrl(uploadedPhotoUrl);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error handling photo upload:', err);
      setError('Failed to upload photo. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number || undefined,
        address: formData.address || undefined,
        photo_url: photoUrl || undefined
      };

      const response = await register(registrationData);
      if (response?.token) {
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Failed to register';
      setError(errorMessage);

      if (photoUrl) {
        try {
          const filename = photoUrl.split('/').pop();
          await uploadAPI.deleteImage(filename);
          setPhoto(null);
          setPhotoUrl(null);
          setPhotoPreview(null);
        } catch (deleteErr) {
          console.error('Error cleaning up photo after failed registration:', deleteErr);
        }
      }
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
          <div className="register-photo-section">
            <div className="register-photo-container">
              <img
                src={photoPreview || '/default-avatar.png'}
                alt="Profile preview"
                className="register-photo-preview"
              />
              <label className="register-photo-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="register-photo-input"
                />
                <span className="register-photo-upload-text">
                  {photo ? 'Change Photo' : 'Add Photo'}
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
              name="phone_number"
              value={formData.phone_number}
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