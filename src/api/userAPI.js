import { apiClient } from "./apiClient";

export const userAPI = {
  // Authentication
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    // Extract data from the nested structure
    return response.data; // This will contain { token, user }
  },

  register: (userData) =>
    apiClient.post("/auth/register", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone_number || "", // Default empty if not provided
      photo_url: userData.photo_url || "https://example.com/default-avatar.jpg", // Default image
    }),

  logout: () => apiClient.post("/auth/logout"),

  // User Management
  getProfile: () => apiClient.get("/user/me"),

  // New method for error testing
  testError: () => apiClient.get("/auth/test-error"),
};
