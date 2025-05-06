import { apiClient } from "./apiClient";

export const userAPI = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/user/me");
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put("/user/profile", userData);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.put("/user/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
