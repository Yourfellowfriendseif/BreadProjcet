import { apiClient } from './apiClient';

export const breadAPI = {
  // Bread Posts
  create: ({ post_type, bread_status, photo_url, quantity, location }) =>
    apiClient.post('/bread/create', {
      post_type,
      bread_status,
      photo_url,
      quantity,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      }
    }),

  getAll: () => apiClient.get('/bread/all'),

  delete: (id) => apiClient.delete(`/bread/delete/${id}`)
};