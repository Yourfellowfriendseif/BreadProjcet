import { apiClient } from "./apiClient";

export const notificationAPI = {
  getNotifications: async () => {
    const response = await apiClient.get("/notifications");
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get("/notifications/unread");
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.put(
      `/notifications/${notificationId}/mark-read`
    );
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put("/notifications/mark-all-read");
    return response.data;
  },
};
