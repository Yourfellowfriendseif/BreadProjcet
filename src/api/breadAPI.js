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

  getNearbyPosts: async ({ location, ...filters }) => {
    const response = await apiClient.post("/posts/nearby", {
      location,
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
    return response.data;
  },

  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    const response = await apiClient.post("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  reserve: async (postId) => {
    const response = await apiClient.put(`/posts/reserve/${postId}`);
    return response.data;
  },

  unreserve: async (postId) => {
    const response = await apiClient.put(`/posts/unreserve/${postId}`);
    return response.data;
  },

  getReservedPosts: async () => {
    const response = await apiClient.get("/posts/reserved");
    return response.data;
  },

  delete: async (postId) => {
    const response = await apiClient.delete(`/posts/delete/${postId}`);
    return response.data;
  },

  update: async (postId, updateData) => {
    const response = await apiClient.put(`/posts/update/${postId}`, updateData);
    return response.data;
  },
};
