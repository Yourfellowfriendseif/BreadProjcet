import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { breadAPI } from '../../api/breadAPI';
import './CreatePost.css';

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    post_type: 'offer', // Changed from 'type' to match backend
    description: '',
    quantity: 1,
    quantity_unit: 'loaves',
    status: 'fresh',
    images: [],
    address: ''
  });

  const [userLocation, setUserLocation] = useState(null);

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.longitude,
            position.coords.latitude
          ]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Please enable location services to create a post');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const validateForm = () => {
    if (!formData.post_type) return 'Post type is required';
    if (!formData.status) return 'Status is required';
    if (!formData.quantity || formData.quantity < 1) return 'Quantity must be at least 1';
    if (!userLocation) return 'Location is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First upload images if any
      let imageIds = [];
      if (formData.images.length > 0) {
        const uploadPromises = formData.images.map(file => 
          breadAPI.uploadImage(file)
        );
        const uploadResponses = await Promise.all(uploadPromises);
        imageIds = uploadResponses.map(res => res.data.id);
      }

      // Prepare post data matching backend requirements
      const postData = {
        post_type: formData.post_type,
        status: formData.status,
        description: formData.description,
        quantity: formData.quantity,
        quantity_unit: formData.quantity_unit,
        location: {
          type: 'Point',
          coordinates: userLocation
        },
        imageIds, // Use uploaded image IDs
        address: formData.address
      };

      await breadAPI.create(postData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create post');
      console.error('Post creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="create-post-title">Create New Post</h1>

      {error && (
        <div className="create-post-error">
          <p className="create-post-error-text">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="create-post-form-group">
          <label className="create-post-label">Post Type</label>
          <select
            value={formData.post_type}
            onChange={(e) => setFormData(prev => ({ ...prev, post_type: e.target.value }))}
            className="create-post-select"
          >
            <option value="offer">Offer</option>
            <option value="request">Request</option>
          </select>
        </div>

        <div className="create-post-form-group">
          <label className="create-post-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="create-post-textarea"
            placeholder="Describe what you're offering or requesting"
          />
        </div>

        <div className="create-post-grid">
          <div className="create-post-form-group">
            <label className="create-post-label">Quantity</label>
            <input
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              className="create-post-input"
            />
          </div>

          <div className="create-post-form-group">
            <label className="create-post-label">Unit</label>
            <select
              value={formData.quantity_unit}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity_unit: e.target.value }))}
              className="create-post-select"
            >
              <option value="loaves">Loaves</option>
              <option value="pieces">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="g">Grams</option>
            </select>
          </div>
        </div>

        <div className="create-post-form-group">
          <label className="create-post-label">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="create-post-select"
          >
            <option value="fresh">Fresh</option>
            <option value="day_old">Day Old</option>
            <option value="stale">Stale</option>
          </select>
        </div>

        <div className="create-post-form-group">
          <label className="create-post-label">Address (Optional)</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter a descriptive address"
            className="create-post-input"
          />
        </div>

        <div className="create-post-form-group">
          <label className="create-post-label">Images (Optional)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="create-post-input"
          />
          <p className="create-post-help-text">You can upload multiple images</p>
        </div>

        <div className="create-post-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="create-post-button create-post-button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="create-post-button create-post-button-primary"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}