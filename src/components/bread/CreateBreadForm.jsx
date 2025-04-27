import { useState } from "react";
import { breadAPI } from "../../api/breadAPI";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
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
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploadingImages(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append('images', file));

      const response = await breadAPI.uploadImages(formData);
      setFormData(prev => ({
        ...prev,
        imageIds: [...prev.imageIds, ...response.data.images.map(img => img._id)]
      }));
    } catch (error) {
      setError("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await breadAPI.create(formData);
      alert("Bread post created successfully!");
    } catch (error) {
      setError(error.message || "Failed to create bread post");
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
        {/* Post Type Dropdown (unchanged) */}
        {/* Bread Condition Dropdown (renamed from bread_status to status) */}
        
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            disabled={uploadingImages}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          {uploadingImages && <p>Uploading images...</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.imageIds.map(id => (
              <div key={id} className="w-16 h-16 bg-gray-200 rounded">
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL}/api/upload/${id}`} 
                  alt="Uploaded preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quantity Input (unchanged) */}
        {/* Location Picker (unchanged) */}

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          disabled={uploadingImages}
        >
          Create Post
        </button>
      </form>
    </div>
  );
}