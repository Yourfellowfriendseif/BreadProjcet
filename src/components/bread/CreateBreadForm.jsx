import { useState } from "react";
import { breadAPI } from "../../api/breadAPI";

/**
 * @typedef {import('../../types/schema').BreadPost} BreadPost
 * @typedef {import('../../types/schema').ApiError} ApiError
 */

export default function CreateBreadForm() {
  /** @type {[{
   *   post_type: 'sell'|'request',
   *   bread_status: 'fresh'|'day_old'|'stale',
   *   photo_url: string,
   *   quantity: number,
   *   location: {
   *     type: 'Point',
   *     coordinates: [number, number]
   *   }
   * }, function]} */
  const [formData, setFormData] = useState({
    post_type: "sell",
    bread_status: "day_old",
    photo_url: "",
    quantity: 1,
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  /** @type {[string, function]} */
  const [error, setError] = useState("");

  /**
   * Handles form submission
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data before submission:", formData);
      await breadAPI.create(formData);
      alert("Bread post created successfully!");
    } catch (error) {
      /** @type {ApiError} */
      const apiError = error;
      setError(apiError.message || "Failed to create bread post");
      console.error("Creation failed:", apiError);
    }
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
            onChange={(e) =>
              setFormData({
                ...formData,
                post_type: /** @type {'sell'|'request'} */ (e.target.value),
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="sell">Selling</option>
            <option value="request">Looking For</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Bread Condition
          </label>
          <select
            value={formData.bread_status}
            onChange={(e) =>
              setFormData({
                ...formData,
                bread_status: /** @type {'fresh'|'day_old'|'stale'} */ (
                  e.target.value
                ),
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="fresh">Fresh</option>
            <option value="day_old">Day Old</option>
            <option value="stale">Stale</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Photo URL</label>
          <input
            type="url"
            value={formData.photo_url}
            onChange={(e) =>
              setFormData({
                ...formData,
                photo_url: e.target.value,
              })
            }
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: parseInt(e.target.value, 10) || 1,
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Location (Latitude(-90, 90) / Longitude(-180, 180))
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              placeholder="Latitude"
              value={formData.location.coordinates[1]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    coordinates: [
                      formData.location.coordinates[0], // keep longitude unchanged
                      parseFloat(e.target.value) || 0,   // update latitude
                    ],
                  },
                })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              placeholder="Longitude"
              value={formData.location.coordinates[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    coordinates: [
                      parseFloat(e.target.value) || 0,    // update longitude
                      formData.location.coordinates[1],   // keep latitude unchanged
                    ],
                  },
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
