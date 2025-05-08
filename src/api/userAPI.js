import { apiClient } from "./apiClient";

export const userAPI = {
  register: async (userData) => {
    // Send as JSON instead of FormData
    const response = await apiClient.post("/auth/register", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone_number,
      // Note: Avatar would need to be handled separately if needed
      // via a different endpoint like PATCH /users/profile
    });

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  },

  login: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      console.log('Full login response:', response);
      
      // Check for response.data or use response directly if data is at root level
      const responseData = response.data || response;
      
      if (!responseData) {
        throw new Error('No data received from server');
      }
      
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
      }
      
      return responseData;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    return response;
  },

  getProfile: async () => {
    const response = await apiClient.get("/user/profile");
    return response.data;
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