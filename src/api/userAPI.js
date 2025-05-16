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
    try {
      const response = await apiClient.get("/user/me");
      return response?.user || response?.data?.user || response;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      if (!userId) throw new Error("User ID is required");

      // Get users from chat endpoint which includes user details
      const response = await apiClient.get("/chat/users");
      let chatUsers = [];

      if (response?.data?.users) {
        chatUsers = response.data.users;
      } else if (response?.users) {
        chatUsers = response.users;
      } else if (Array.isArray(response)) {
        chatUsers = response;
      }

      // Find the specific user
      const user = chatUsers.find((u) => u._id === userId);

      if (!user) {
        // If user not found in chat users, try getting from all users
        const allUsersResponse = await apiClient.get("/user/all");
        let allUsers = [];

        if (allUsersResponse?.data?.users) {
          allUsers = allUsersResponse.data.users;
        } else if (allUsersResponse?.users) {
          allUsers = allUsersResponse.users;
        } else if (Array.isArray(allUsersResponse)) {
          allUsers = allUsersResponse;
        }

        const userFromAll = allUsers.find((u) => u._id === userId);
        if (!userFromAll) {
          throw new Error("User not found");
        }
        return userFromAll;
      }

      return user;
    } catch (error) {
      console.error("Error in getUserById:", error);
      throw error;
    }
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
