import { apiClient } from './apiClient';

export const breadAPI = {
  // Bread Posts
  create: (breadData) => apiClient.post('/bread/create', {
    post_type: breadData.post_type || 'sell', // Default to 'sell'
    bread_status: breadData.bread_status || 'day_old', // Default status
    photo_url: breadData.photo_url || '',
    quantity: breadData.quantity || 1, // Default quantity
    location: {
      type: 'Point',
      coordinates: [
        breadData.location?.lng || 0, // Default longitude
        breadData.location?.lat || 0  // Default latitude
      ]
    }
  }),

  getAll: () => apiClient.get('/bread/all'),

  getByLocation: (lat, lng, radius) => 
    apiClient.get('/bread/nearby', {
      params: { lat, lng, radius }
    }),

  delete: (id) => apiClient.delete(`/bread/delete/${id}`),

  // New method for status updates
  updateStatus: (id, newStatus) => 
    apiClient.patch(`/bread/${id}/status`, { status: newStatus })
};