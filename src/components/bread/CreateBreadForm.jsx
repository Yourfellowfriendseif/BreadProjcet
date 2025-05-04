import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { breadAPI } from '../../api/breadAPI';
import LocationPicker from '../common/LocationPicker.jsx';
import ImageUpload from '../common/ImageUpload';
import LoadingSpinner from '../LoadingSpinner';

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
        const uploadResponse = await breadAPI.uploadImages(images);
        imageIds = uploadResponse.data.images;
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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Post Type
            </label>
            <select
              name="post_type"
              value={formData.post_type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="sell">Sell</option>
              <option value="request">Request</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="fresh">Fresh</option>
              <option value="day_old">Day Old</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe your bread..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              name="quantity_unit"
              value={formData.quantity_unit}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="pieces">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="g">Grams</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <ImageUpload onImagesSelected={handleImagesSelected} maxImages={4} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <LocationPicker onLocationSelect={setLocation} />
          {!location && (
            <p className="mt-1 text-sm text-red-600">
              Please select a location on the map
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !location}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner /> : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
