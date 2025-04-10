import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token interceptor (prepared for future auth)
apiClient.interceptors.response.use(
  (response) => response.data, // ← Directly return .data
  (error) => {
    // MongoDB errors often come in .data.error
    console.error('Error:', error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);