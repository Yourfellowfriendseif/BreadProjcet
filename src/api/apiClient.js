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
    // Handle the standard backend response structure
    if (response.data?.status === "success") {
      // For upload endpoints, return the image data directly
      if (response.config.url.includes("/upload")) {
        return response.data.data.image;
      }
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Network error
    if (!error.response) {
      return Promise.reject({
        status: "error",
        message: "Network error - please check your internet connection",
        isNetworkError: true,
      });
    }

    // Handle specific error cases
    const errorResponse = error.response.data || {};

    switch (error.response.status) {
      case 401:
        // Clear token if it's invalid or expired
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject({
          status: "error",
          message: errorResponse.message || "Authentication failed",
        });

      case 409:
        return Promise.reject({
          status: "fail",
          message: errorResponse.message || "A conflict occurred",
          field: errorResponse.field || "unknown",
        });

      case 413:
        return Promise.reject({
          status: "error",
          message: "File too large - please upload a smaller file",
        });

      case 415:
        return Promise.reject({
          status: "error",
          message: "Unsupported file type",
        });
    }

    // Format validation errors
    if (errorResponse.errors) {
      const validationErrors = {};
      errorResponse.errors.forEach((err) => {
        validationErrors[err.param] = err.msg;
      });
      return Promise.reject({
        status: "fail",
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Return formatted error
    return Promise.reject({
      status: errorResponse.status || "error",
      message: errorResponse.message || "An error occurred",
      data: errorResponse.data,
    });
  }
);

export default apiClient;
