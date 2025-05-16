import { apiClient } from "./apiClient";
import { userAPI } from "./userAPI";

export const chatAPI = {
  getMessageHistory: async (userId, params = {}) => {
    try {
      if (!userId) throw new Error("User ID is required");
      return await apiClient.get(`/chat/messages/${userId}`, { params });
    } catch (error) {
      console.error("Error fetching message history:", error);
      throw error;
    }
  },

  sendMessage: async (recipientId, content) => {
    try {
      if (!recipientId) throw new Error("Recipient ID is required");
      if (!content || !content.trim())
        throw new Error("Message content is required");

      return await apiClient.post("/chat/send", {
        recipientId,
        content: content.trim(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  markAsRead: async (messageId) => {
    try {
      if (!messageId) throw new Error("Message ID is required");
      return await apiClient.put(`/chat/messages/${messageId}/read`);
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      return await apiClient.get("/chat/unread");
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  },

  getUserInfo: async (userId) => {
    try {
      if (!userId) throw new Error("User ID is required");
      const user = await userAPI.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return { data: user };
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },

  getConversations: async () => {
    try {
      console.log("Fetching conversations...");

      // Get current user first
      const currentUser = await userAPI.getProfile();
      console.log("Current user:", currentUser);

      // Get chat users first
      const chatUsersResponse = await apiClient.get("/chat/users");
      console.log("Chat users response:", chatUsersResponse);

      // Extract users from the response
      const users = chatUsersResponse?.data?.data?.users || [];
      console.log("Users from response:", users);

      // Create conversations from users
      const conversations = users
        .filter((user) => user._id !== currentUser._id)
        .map((user) => ({
          _id: `chat_${user._id}`,
          participants: [currentUser, user],
          lastMessage: null,
          updatedAt: new Date().toISOString(),
          unreadCount: 0,
        }));

      // For each user, get their last message
      for (const conversation of conversations) {
        try {
          const otherUser = conversation.participants.find(
            (p) => p._id !== currentUser._id
          );
          const messagesResponse = await apiClient.get(
            `/chat/messages/${otherUser._id}`,
            {
              params: { limit: 1 },
            }
          );

          if (messagesResponse?.data?.data?.messages?.length > 0) {
            const lastMessage = messagesResponse.data.data.messages[0];
            conversation.lastMessage = lastMessage;
            conversation.updatedAt = lastMessage.createdAt;
          }
        } catch (error) {
          console.error(
            `Error fetching messages for user ${conversation._id}:`,
            error
          );
        }
      }

      // Sort conversations by most recent message
      conversations.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      console.log("Final conversations:", conversations);
      return { data: { conversations } };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return { data: { conversations: [] } };
    }
  },
};
