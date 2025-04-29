import { apiClient } from "./apiClient";

export const breadAPI = {
  // Image Upload Endpoints
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  uploadMultipleImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return apiClient.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteImage: (filename) => apiClient.delete(`/upload/${filename}`),

  // Bread Posts Endpoints
  create: (breadData) => {
    return apiClient.post('/posts/create', {
      post_type: breadData.post_type || 'sell',
      status: breadData.status || 'fresh',
      category: breadData.category || 'bread',
      description: breadData.description || '',
      quantity: breadData.quantity || 1,
      location: {
        type: 'Point',
        coordinates: breadData.location?.coordinates || [0, 0]
      },
      imageIds: breadData.imageIds || []
    });
  },

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

  getById: (id) => apiClient.get(`/posts/${id}`),

  update: (id, breadData) => apiClient.put(`/posts/update/${id}`, breadData),

  delete: (id) => apiClient.delete(`/posts/delete/${id}`),

  // Location-based Endpoints
  getNearby: (lat, lng, radius) => 
    apiClient.post('/posts/nearby', {
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      maxDistance: radius
    }),

  // Reservation Endpoints
  reserve: (id) => apiClient.put(`/posts/reserve/${id}`),
  
  unreserve: (id) => apiClient.put(`/posts/unreserve/${id}`),

  getReserved: () => apiClient.get('/posts/reserved'),

  // User Posts
  getUserPosts: () => apiClient.get('/posts/user'),

  getPostsByUser: (userId) => apiClient.get(`/posts/user/${userId}`),

  // Search Endpoint
  search: (query, filters = {}) => {
    const params = new URLSearchParams({ q: query });
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.post_type) params.append('post_type', filters.post_type);
    if (filters.lat && filters.lng) {
      params.append('lat', filters.lat);
      params.append('lng', filters.lng);
    }
    if (filters.radius) params.append('radius', filters.radius);
    return apiClient.get(`/posts/search?${params.toString()}`);
  },

  // Status Updates
  updateStatus: (id, newStatus) => 
    apiClient.patch(`/posts/${id}/status`, { status: newStatus })
};