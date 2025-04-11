import { apiClient } from './apiClient';
import { BreadStates } from '../types/dbTypes';

export const breadAPI = {
  // Bread CRUD
  create: (breadData) => 
    apiClient.post('/breads', {
      ...breadData,
      state: BreadStates.DAY_OLD,
      createdAt: new Date().toISOString()
    }),
  
  getById: (breadId) => 
    apiClient.get(`/breads/${breadId}`),
    
  updateState: (breadId, newState) => 
    apiClient.patch(`/breads/${breadId}`, { 
      state: newState,
      updatedAt: new Date().toISOString() 
    }),

  // Listings Integration
  createListing: (breadId, listingData) => 
    apiClient.post('/listings', {
      breadId,
      type: 'sell', // or 'request'
      ...listingData,
      status: 'active'
    }),
    
  getBreadListings: (breadId) => 
    apiClient.get(`/breads/${breadId}/listings`),
    
  searchBreads: (filters) => 
    apiClient.get('/breads/search', { params: filters })
};