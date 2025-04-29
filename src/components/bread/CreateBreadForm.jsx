import { useState } from "react";
import { breadAPI } from "../../api/breadAPI";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const iconRetinaUrl = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href;
const iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href;
const shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function LocationPicker({ onLocationSelect, initialCoords = [0, 0] }) {
  const [position, setPosition] = useState(initialCoords);

  const LocationFinder = () => {
    useMapEvents({
      click(e) {
        const newPosition = [e.latlng.lng, e.latlng.lat];
        setPosition(newPosition);
        onLocationSelect(newPosition);
      },
    });
    return position ? <Marker position={[position[1], position[0]]} /> : null;
  };

  return (
    <MapContainer
      center={[initialCoords[1], initialCoords[0]]}
      zoom={13}
      style={{ height: '400px', width: '100%', marginTop: '1rem' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationFinder />
    </MapContainer>
  );
}

export default function CreateBreadForm() {
  const [formData, setFormData] = useState({
    post_type: "sell",
    status: "fresh",
    category: "bread",
    description: "",
    quantity: 1,
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    imageIds: []
  });

  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let uploadedImageIds = [];
      if (imageFiles.length > 0) {
        const uploadFormData = new FormData();
        imageFiles.forEach(file => uploadFormData.append('images', file));
        
        const uploadResponse = await breadAPI.uploadMultipleImages(uploadFormData);
        uploadedImageIds = uploadResponse.images?.map(img => img.id) || []

        console.log("Upload response:", uploadResponse);
        console.log("Extracted image IDs:", uploadedImageIds);
      }

      const postData = {
        ...formData,
        imageIds: uploadedImageIds
      };

      const response = await breadAPI.create(postData);
      console.log("Post created:", response);

      alert("Bread post created successfully!");
      
      setFormData({
        post_type: "sell",
        status: "fresh",
        category: "bread",
        description: "",
        quantity: 1,
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        imageIds: []
      });
      setImageFiles([]);
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (coords) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        coordinates: coords,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Bread Post</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Post Type</label>
          <select
            value={formData.post_type}
            onChange={(e) => setFormData({...formData, post_type: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="sell">Selling</option>
            <option value="request">Looking For</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bread Condition</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="fresh">Fresh</option>
            <option value="day_old">Day Old</option>
            <option value="stale">Stale</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Bread category"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="Describe your bread..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <LocationPicker 
            onLocationSelect={handleLocationSelect}
            initialCoords={formData.location.coordinates}
          />
          <div className="mt-2 text-sm text-gray-600">
            Selected coordinates: 
            <span className="font-mono ml-2">
              {formData.location.coordinates[1]?.toFixed(6)}, 
              {formData.location.coordinates[0]?.toFixed(6)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}