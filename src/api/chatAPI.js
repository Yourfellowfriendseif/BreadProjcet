import { apiClient } from "./apiClient";

export const chatAPI = {
  getMessageHistory: async (userId, params = {}) => {
    return apiClient.get(`/chat/messages/${userId}`, { params });
  },

  sendMessage: async (recipientId, content) => {
    return apiClient.post("/chat/send", {
      recipientId,
      content,
    });
  },

  markAsRead: async (messageId) => {
    return apiClient.put(`/chat/messages/${messageId}/read`);
  },

  getUnreadCount: async () => {
    return apiClient.get("/chat/unread");
  },
};
