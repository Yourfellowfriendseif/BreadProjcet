import { apiClient } from "./apiClient";

export const breadAPI = {
  // Bread Posts
  create: (breadData) =>
    apiClient.post("/posts/create", {
      post_type: breadData.post_type || "sell", // Default to 'sell'
      bread_status: breadData.bread_status || "day_old", // Default status
      photo_url: breadData.photo_url || "https://example.com/image.jpg", // Default image URL
      quantity: breadData.quantity || 1, // Default quantity
      location: {
        type: "Point",
        coordinates: [
          breadData.location.coordinates[0] || 0, // Default latitude
          breadData.location.coordinates[1] || 0, // Default longitude
        ],
      },
    }),

  getAll: async () => {
    try {
      console.log("Calling /posts/all endpoint...");
      const response = await apiClient.get("/posts/all");
      console.log("Response from /posts/all:", response);
      return response;
    } catch (error) {
      console.error("Error in breadAPI.getAll:", error);
      throw error;
    }
  },

  getByLocation: (lat, lng, radius) =>
    apiClient.get("/posts/nearby", {
      params: { lat, lng, radius },
    }),

  delete: (id) => apiClient.delete(`/posts/delete/${id}`),

  // New method for status updates
  updateStatus: (id, newStatus) =>
    apiClient.patch(`/posts/${id}/status`, { status: newStatus }),
};
