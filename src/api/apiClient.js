// src/api/apiClient.js
import axios from "axios";

/**
 * @typedef {import('../types/schema').ApiError} ApiError
 * @typedef {import('../types/schema').BreadPost} BreadPost
 * @typedef {import('../types/schema').User} User
 */

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add JWT interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        /** @type {ApiError} */ ({
          message: "Network Error - Please check your connection",
          isNetworkError: true,
        })
      );
    }

    const { status, data } = error.response;

    /** @type {ApiError} */
    const apiError = {
      message: data?.message || `Request failed with status ${status}`,
      status,
      errors: data?.errors,
      conflictField: data?.field,
    };

    switch (status) {
      case 400:
        apiError.message = data?.message || "Invalid request data";
        break;
      case 401:
        apiError.message =
          data?.message || "Session expired - Please login again";
        break;
      case 403:
        apiError.message =
          data?.message || "You are not authorized for this action";
        break;
      case 404:
        apiError.message = data?.message || "Resource not found";
        break;
      case 409:
        apiError.message = data?.message || "Conflict detected";
        apiError.conflictField = data?.field;
        break;
      case 422:
        apiError.message = "Validation failed";
        break;
      case 500:
        apiError.message =
          data?.message || "Server error - Please try again later";
        break;
    }

    return Promise.reject(apiError);
  }
);

/**
 * Search for bread posts or users
 * @param {string} query - Search term
 * @param {'bread'|'user'} type - Type of search
 * @param {Object} [filters] - Additional filters
 * @param {number} [filters.radius] - Search radius in meters (for location-based searches)
 * @param {[number, number]} [filters.location] - [longitude, latitude] for location-based searches
 * @returns {Promise<{bread?: BreadPost[], users?: User[]}>} Search results
 */
export const search = async (query, type = "bread", filters = {}) => {
  const params = new URLSearchParams({ q: query, type });

  if (filters.radius) params.append("radius", filters.radius);
  if (filters.location) {
    params.append("lng", filters.location[0]);
    params.append("lat", filters.location[1]);
  }

  return apiClient.get(`/search?${params.toString()}`);
};

// Add to your existing exports if you have others
export default apiClient;
