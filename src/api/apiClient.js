// src/api/apiClient.js
import axios from "axios";

/**
 * @typedef {import('../types/schema').ApiError} ApiError
 * @typedef {import('../types/schema').BreadPost} BreadPost
 * @typedef {import('../types/schema').User} User
 */

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    // If the response has a data.data structure, return just the data
    if (response.data?.data) {
      return response.data.data;
    }
    return response;
  },
  (error) => {
    // Network error
    if (!error.response) {
      return Promise.reject({
        message: "Network error - please check your internet connection",
        isNetworkError: true,
      });
    }

    // Handle specific error cases
    switch (error.response.status) {
      case 401:
        // Clear token if it's invalid or expired
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        break;

      case 409:
        // Handle conflict errors (e.g., duplicate email/username)
        const conflictField = error.response.data.field || "unknown";
        return Promise.reject({
          message: error.response.data.message || "A conflict occurred",
          conflictField,
        });

      case 413:
        return Promise.reject({
          message: "File too large - please upload a smaller file",
        });

      case 415:
        return Promise.reject({
          message: "Unsupported file type",
        });
    }

    // Format validation errors
    if (error.response.data?.errors) {
      const validationErrors = {};
      error.response.data.errors.forEach((err) => {
        validationErrors[err.param] = err.msg;
      });
      return Promise.reject({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Return formatted error
    return Promise.reject({
      message: error.response.data?.message || "An error occurred",
      status: error.response.status,
      data: error.response.data,
    });
  }
);

export default apiClient;
