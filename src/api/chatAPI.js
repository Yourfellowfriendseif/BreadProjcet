import { apiClient } from "./apiClient";

export const chatAPI = {
  getRecentChats: async () => {
    const response = await apiClient.get("/chat/recent");
    return response.data;
  },

  getMessages: async (recipientId, page = 1, limit = 20) => {
    const response = await apiClient.get(`/chat/messages/${recipientId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  sendMessage: async (recipientId, content) => {
    const response = await apiClient.post("/chat/send", {
      recipientId,
      content,
    });
    return response.data;
  },

  markAsRead: async (messageIds) => {
    const response = await apiClient.put("/chat/mark-read", {
      messageIds: Array.isArray(messageIds) ? messageIds : [messageIds],
    });
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await apiClient.delete(`/chat/messages/${messageId}`);
    return response.data;
  },

  getChatById: async (chatId) => {
    const response = await apiClient.get(`/chat/${chatId}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get("/chat/unread/count");
    return response.data;
  },
};
