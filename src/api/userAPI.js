import { apiClient } from "./apiClient";

export const userAPI = {
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone,
      address: userData.address,
    });

    if (response?.token) {
      localStorage.setItem("token", response.token);
    }

    return response;
  },

  login: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);

      if (response?.token) {
        localStorage.setItem("token", response.token);
      }

      return response;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    return response;
  },

  getProfile: async () => {
    const res = await apiClient.get("/user/me");
    return res.user;
  },

  getUserById: async (userId) => {
    // Workaround: fetch all users and find the one with the matching ID
    const allUsers = await apiClient.get("/user/all");
    if (Array.isArray(allUsers)) {
      return allUsers.find((u) => u._id === userId);
    } else if (allUsers?.users) {
      return allUsers.users.find((u) => u._id === userId);
    }
    throw new Error("User not found");
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

    return apiClient.put("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updatePassword: async ({ currentPassword, newPassword }) => {
    return apiClient.put("/user/password", {
      currentPassword,
      newPassword,
    });
  },

  searchUsers: async (query) => {
    return apiClient.get("/user/search", {
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
