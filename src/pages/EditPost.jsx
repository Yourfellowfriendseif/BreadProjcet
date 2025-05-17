import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import breadAPI from "../api/breadAPI";
import "../components/bread/CreatePost.css";

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M-Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane",
];

export default function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    post_type: "sell",
    description: "",
    quantity: 1,
    quantity_unit: "pieces",
    status: "fresh",
    category: "bread",
    images: [],
    address: "",
    province: "",
  });
  const [userLocation, setUserLocation] = useState(null);
  const [imageIds, setImageIds] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageFilenames, setImageFilenames] = useState([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await breadAPI.getById(id);
        const post = res.data?.post || res.post || res;
        setFormData({
          post_type: post.post_type,
          description: post.description,
          quantity: post.quantity,
          quantity_unit: post.quantity_unit,
          status: post.status,
          category: post.category,
          images: [],
          address: post.address || "",
          province: post.province || "",
        });
        setImageUrls(post.images?.map(img => img.url) || []);
        setImageIds(post.images?.map(img => img._id) || []);
        setImageFilenames(post.images?.map(img => img.filename) || []);
        setUserLocation(post.location?.coordinates || null);
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
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
      const uploadedImages = res?.data?.images;
      if (!uploadedImages || !Array.isArray(uploadedImages)) {
        throw new Error("Invalid response from server");
      }
      const ids = uploadedImages.map((img) => img._id);
      const urls = uploadedImages.map((img) => img.url);
      const filenames = uploadedImages.map((img) => img.filename);
      setImageIds(ids);
      setImageUrls(urls);
      setImageFilenames(filenames);
      setImageUploadError(null);
      e.target.value = "";
    } catch (err) {
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
    if (imageUploadLoading) {
      setError("Please wait for images to finish uploading.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare the update data
      const updateData = {
        post_type: formData.post_type,
        status: formData.status,
        category: formData.category,
        description: formData.description,
        quantity: formData.quantity,
        quantity_unit: formData.quantity_unit,
        location: {
          type: "Point",
          coordinates: userLocation
        },
        address: formData.address,
        province: formData.province,
        imageIds: imageIds // Send only the image IDs
      };
      
      const response = await breadAPI.updatePost(id, updateData);
      if (!response.data) {
        throw new Error("Failed to update post");
      }
      navigate("/my-posts");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="create-post-title">Edit Post</h1>
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
        <div className="create-post-form-group">
          <label className="create-post-label">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="create-post-input"
          />
        </div>
        <div className="create-post-form-group">
          <label className="create-post-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="create-post-textarea"
            rows={3}
          />
        </div>
        <div className="create-post-form-group">
          <label className="create-post-label">Quantity</label>
          <input
            type="number"
            min={1}
            value={formData.quantity}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, quantity: Number(e.target.value) }))
            }
            className="create-post-input"
          />
        </div>
        <div className="create-post-form-group">
          <label className="create-post-label">Quantity Unit</label>
          <select
            value={formData.quantity_unit}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, quantity_unit: e.target.value }))
            }
            className="create-post-select"
          >
            <option value="pieces">Pieces</option>
            <option value="kg">Kg</option>
            <option value="g">g</option>
            <option value="loaves">Loaves</option>
            <option value="boxes">Boxes</option>
            <option value="packages">Packages</option>
          </select>
        </div>
        <div className="create-post-form-group">
          <label className="create-post-label">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            className="create-post-input"
          />
        </div>
        <div className="create-post-form-group">
          <label className="create-post-label">Province</label>
          <select
            value={formData.province}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, province: e.target.value }))
            }
            className="create-post-select"
          >
            <option value="">Select Province</option>
            {WILAYAS.map((wilaya) => (
              <option key={wilaya} value={wilaya}>{wilaya}</option>
            ))}
          </select>
        </div>
        <div className="create-post-form-group">
          <label className="create-post-label">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="create-post-input"
          />
          {imageUploadLoading && (
            <div className="create-post-image-progress">
              Uploading... {imageUploadProgress}%
            </div>
          )}
          {imageUploadError && (
            <div className="create-post-error">
              <p className="create-post-error-text">{imageUploadError}</p>
            </div>
          )}
          <div className="create-post-image-preview">
            {imageUrls.map((url, idx) => (
              <img key={idx} src={url} alt="Preview" className="create-post-image-thumb" />
            ))}
          </div>
        </div>
        <button type="submit" className="create-post-submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
} 