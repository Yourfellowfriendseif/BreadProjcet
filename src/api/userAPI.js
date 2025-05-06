import { apiClient } from "./apiClient";

export const userAPI = {
  register: async (userData) => {
    const formData = new FormData();

    if (userData.avatar) {
      formData.append("photo", userData.avatar);
      delete userData.avatar;
    }

    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    const response = await apiClient.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    return response;
  },

  getCurrentUser: async () => {
    return apiClient.get("/users/me");
  },

  getUserById: async (userId) => {
    return apiClient.get(`/users/${userId}`);
  },

  updateProfile: async (updateData) => {
    const formData = new FormData();

    if (updateData.avatar) {
      formData.append("photo", updateData.avatar);
      delete updateData.avatar;
    }

    Object.keys(updateData).forEach((key) => {
      if (typeof updateData[key] === "object") {
        formData.append(key, JSON.stringify(updateData[key]));
      } else {
        formData.append(key, updateData[key]);
      }
    });

    return apiClient.put("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updatePassword: async ({ currentPassword, newPassword }) => {
    return apiClient.put("/users/password", {
      currentPassword,
      newPassword,
    });
  },

  searchUsers: async (query) => {
    return apiClient.get("/users/search", {
      params: { q: query },
    });
  },

  requestPasswordReset: async (email) => {
    return apiClient.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token, newPassword) => {
    return apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
  },

  verifyEmail: async (token) => {
    return apiClient.post("/auth/verify-email", { token });
  },
};
