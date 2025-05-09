import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { breadAPI } from '../../api/breadAPI';
import LocationPicker from '../common/LocationPicker.jsx';
import ImageUpload from '../common/ImageUpload';
import LoadingSpinner from '../LoadingSpinner';
import './CreateBreadForm.css';

export default function CreateBreadForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [formData, setFormData] = useState({
    post_type: 'sell',
    status: 'fresh',
    description: '',
    quantity: '',
    quantity_unit: 'pieces',
    category: 'bread'
  });

  const handleImagesSelected = (selectedImages) => {
    setImages(selectedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError('Please select a location');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Upload images first if any
      let imageIds = [];
      if (images.length > 0) {
        const uploadResponse = await breadAPI.uploadImage(images);
        // The response structure includes data.images array containing the saved image objects
        imageIds = uploadResponse.data.images.map(img => img._id);
      }

      // Create the post
      await breadAPI.create({
        ...formData,
        location: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        },
        imageIds
      });

      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="create-bread-form">
      <h2 className="create-bread-form-title">Create New Post</h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="create-bread-form-error">
            <p className="create-bread-form-error-text">{error}</p>
          </div>
        )}

        <div className="create-bread-form-grid">
          <div className="create-bread-form-group">
            <label className="create-bread-form-label">
              Post Type
            </label>
            <select
              name="post_type"
              value={formData.post_type}
              onChange={handleInputChange}
              className="create-bread-form-select"
            >
              <option value="sell">Sell</option>
              <option value="request">Request</option>
            </select>
          </div>

          <div className="create-bread-form-group">
            <label className="create-bread-form-label">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="create-bread-form-select"
            >
              <option value="fresh">Fresh</option>
              <option value="day_old">Day Old</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="create-bread-form-group">
          <label className="create-bread-form-label">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="create-bread-form-textarea"
            placeholder="Describe your bread..."
          />
        </div>

        <div className="create-bread-form-grid">
          <div className="create-bread-form-group">
            <label className="create-bread-form-label">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className="create-bread-form-input"
            />
          </div>

          <div className="create-bread-form-group">
            <label className="create-bread-form-label">
              Unit
            </label>
            <select
              name="quantity_unit"
              value={formData.quantity_unit}
              onChange={handleInputChange}
              className="create-bread-form-select"
            >
              <option value="pieces">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="g">Grams</option>
            </select>
          </div>
        </div>

        <div className="create-bread-form-group">
          <label className="create-bread-form-label">
            Images
          </label>
          <ImageUpload onImagesSelected={handleImagesSelected} maxImages={4} />
        </div>

        <div className="create-bread-form-group">
          <label className="create-bread-form-label">
            Location
          </label>
          <LocationPicker onLocationSelect={setLocation} />
          {!location && (
            <p className="create-bread-form-location-error">
              Please select a location on the map
            </p>
          )}
        </div>

        <div className="create-bread-form-submit">
          <button
            type="submit"
            disabled={loading || !location}
            className="create-bread-form-button"
          >
            {loading ? <LoadingSpinner /> : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
