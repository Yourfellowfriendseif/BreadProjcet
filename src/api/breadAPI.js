import { apiClient } from "./apiClient";

export const breadAPI = {
  create: async (postData) => {
    const response = await apiClient.post("/posts/create", postData);
    return response.data;
  },

  getAll: async (filters = {}) => {
    const response = await apiClient.get("/posts/all", { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  getByUser: async (userId) => {
    const response = await apiClient.get(`/posts/user/${userId}`);
    return response.data;
  },

  getNearbyPosts: async ({ lat, lng, maxDistance, ...filters }) => {
    const response = await apiClient.post("/posts/nearby", {
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      maxDistance,
      ...filters,
    });
    return response.data;
  },

  search: async (params) => {
    const response = await apiClient.get("/posts/search", { params });
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAllPosts: async () => {
    return apiClient.get("/posts/all");
  },

  getPostById: async (postId) => {
    return apiClient.get(`/posts/${postId}`);
  },

  updatePost: async (postId, updateData) => {
    const formData = new FormData();

    if (updateData.images?.length > 0) {
      updateData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Convert location to GeoJSON Point format if not already
    if (updateData.location && !updateData.location.type) {
      updateData.location = {
        type: "Point",
        coordinates: [updateData.location[0], updateData.location[1]],
      };
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== "images") {
        if (typeof updateData[key] === "object") {
          formData.append(key, JSON.stringify(updateData[key]));
        } else {
          formData.append(key, updateData[key]);
        }
      }
    });

    return apiClient.put(`/posts/update/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deletePost: async (postId) => {
    return apiClient.delete(`/posts/delete/${postId}`);
  },

  searchPosts: async (filters = {}) => {
    return apiClient.get("/posts/search", { params: filters });
  },

  getNearbyPosts: async ({ location, maxDistance }) => {
    return apiClient.post("/posts/nearby", {
      location: {
        gps: {
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        },
      },
      maxDistance,
    });
  },

  reservePost: async (postId) => {
    return apiClient.put(`/posts/reserve/${postId}`);
  },

  cancelReservation: async (postId) => {
    return apiClient.put(`/posts/unreserve/${postId}`);
  },

  getReservedPosts: async () => {
    return apiClient.get("/posts/reserved");
  },

  getUserPosts: async (userId, params = {}) => {
    const endpoint = userId ? `/posts/user/${userId}` : "/posts/user";
    return apiClient.get(endpoint, { params });
  },
};
