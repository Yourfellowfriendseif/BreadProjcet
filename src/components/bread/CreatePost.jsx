import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { breadAPI } from "../../api/breadAPI";
import "./CreatePost.css";

const WILAYAS = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Algiers",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M-Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arréridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
];

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    post_type: "sell", // Changed from 'offer' to match backend
    description: "",
    quantity: 1,
    quantity_unit: "pieces", // Changed default to match backend
    status: "fresh",
    category: "bread", // Added category field
    images: [],
    address: "",
    province: "",
  });

  const [userLocation, setUserLocation] = useState(null);
  const [imageIds, setImageIds] = useState([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.longitude,
            position.coords.latitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Please enable location services to create a post");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
    if (files.length === 0) {
      setImageIds([]);
      setImageUploadError(null);
      setImageUploadProgress(0);
      return;
    }
    setImageUploadLoading(true);
    setImageUploadError(null);
    setImageUploadProgress(0);
    try {
      const uploadFormData = new FormData();
      files.forEach((file) => uploadFormData.append("images", file));
      const res = await breadAPI.uploadImages(
        uploadFormData,
        setImageUploadProgress
      );

      console.log("Upload response:", res);

      // Extract images from the response based on the actual structure
      // {status, message, data: {images: [{_id, filename, url, ...}]}};
      const uploadedImages = res?.data?.images;

      console.log("Uploaded images data:", uploadedImages);

      if (!uploadedImages || !Array.isArray(uploadedImages)) {
        console.error("Unexpected response structure:", res);
        throw new Error("Invalid response from server");
      }

      console.log("Uploaded images:", uploadedImages);

      // Extract IDs from the response
      const ids = uploadedImages.map((img) => img._id);
      console.log("Image IDs:", ids);

      if (ids.length === files.length) {
        setImageIds(ids);
        setImageUploadError(null);
        e.target.value = ""; // Clear the file input after successful upload
      } else {
        console.warn(
          `Mismatch: ${ids.length} images processed, ${files.length} uploaded`
        );
        setImageIds(ids); // Still use the IDs we got back - they were uploaded successfully
        setImageUploadError(
          `Note: ${ids.length} of ${files.length} images processed. Your post will include the processed images.`
        );
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setImageUploadError(err.message || "Failed to upload images");
      setImageIds([]);
    } finally {
      setImageUploadLoading(false);
      setImageUploadProgress(0);
    }
  };

  const validateForm = () => {
    if (!formData.post_type) return "Post type is required";
    if (!formData.status) return "Status is required";
    if (!formData.quantity || formData.quantity < 1)
      return "Quantity must be at least 1";
    if (!userLocation) return "Location is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (
      formData.images.length > 0 &&
      (imageIds.length !== formData.images.length || imageUploadLoading)
    ) {
      setError("Please wait for images to finish uploading.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const postData = {
        post_type: formData.post_type,
        status: formData.status,
        category: formData.category,
        description: formData.description,
        quantity: formData.quantity,
        quantity_unit: formData.quantity_unit,
        location: {
          type: "Point",
          coordinates: userLocation,
        },
        address: formData.address,
        province: formData.province,
        imageIds: imageIds,
      };
      await breadAPI.create(postData);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create post");
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, post_type: e.target.value }))
            }
            className="create-post-select"
          >
            <option value="sell">Sell</option>
            <option value="request">Request</option>
          </select>
        </div>

        <div className="create-post-form-group">
          <label className="create-post-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            className="create-post-textarea"
            placeholder="Describe what you're offering or requesting"
            maxLength={1000}
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
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 1,
                }))
              }
              className="create-post-input"
            />
          </div>

          <div className="create-post-form-group">
            <label className="create-post-label">Unit</label>
            <select
              value={formData.quantity_unit}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity_unit: e.target.value,
                }))
              }
              className="create-post-select"
            >
              <option value="pieces">Pieces</option>
              <option value="loaves">Loaves</option>
              <option value="kg">Kilograms</option>
              <option value="g">Grams</option>
              <option value="boxes">Boxes</option>
              <option value="packages">Packages</option>
            </select>
          </div>
        </div>

        <div className="create-post-form-group">
          <label className="create-post-label">Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value }))
            }
            className="create-post-select"
          >
            <option value="fresh">Fresh</option>
            <option value="day_old">Day Old</option>
            <option value="stale">Stale</option>
          </select>
        </div>

        <div className="create-post-grid">
          <div className="create-post-form-group">
            <label className="create-post-label">Province</label>
            <select
              value={formData.province || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, province: e.target.value }))
              }
              className="create-post-select"
              required
            >
              <option value="">Select Province</option>
              {WILAYAS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          <div className="create-post-form-group">
            <label className="create-post-label">Address (Optional)</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Enter a descriptive address"
              className="create-post-input"
            />
          </div>
        </div>

        <div className="create-post-form-group">
          <label className="create-post-label">Images (Optional)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="create-post-input"
            disabled={imageUploadLoading}
          />
          {imageUploadLoading && (
            <div style={{ width: "100%", margin: "8px 0" }}>
              <progress
                value={imageUploadProgress}
                max="100"
                style={{ width: "100%" }}
              />
              <span>{imageUploadProgress}%</span>
            </div>
          )}
          {imageUploadError && (
            <p className="create-post-error-text">{imageUploadError}</p>
          )}
          <p className="create-post-help-text">
            You can upload multiple images
          </p>
        </div>

        <div className="create-post-actions">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="create-post-button create-post-button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="create-post-button create-post-button-primary"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
