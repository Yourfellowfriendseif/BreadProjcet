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
      const response = await apiClient.get("/chat/users");
      console.log("Chat users response:", response);

      const currentUser = await userAPI.getProfile();
      console.log("Current user:", currentUser);

      // If no users returned, try to get conversations from messages
      if (!response?.data?.users || response.data.users.length === 0) {
        console.log(
          "No users found in chat users response, trying to get from messages..."
        );
        try {
          // Get all messages for the current user
          const messagesResponse = await apiClient.get("/chat/messages/all");
          console.log("All messages response:", messagesResponse);

          if (messagesResponse?.data?.messages) {
            const uniqueUsers = new Set();
            const userMessages = new Map();

            // Process messages to get unique users and their last messages
            messagesResponse.data.messages.forEach((msg) => {
              const otherUserId =
                msg.sender._id === currentUser._id
                  ? msg.recipient._id
                  : msg.sender._id;
              uniqueUsers.add(otherUserId);

              // Keep track of the latest message for each user
              if (
                !userMessages.has(otherUserId) ||
                new Date(msg.createdAt) >
                  new Date(userMessages.get(otherUserId).createdAt)
              ) {
                userMessages.set(otherUserId, msg);
              }
            });

            // Convert to the expected format
            const conversations = Array.from(uniqueUsers).map((userId) => {
              const lastMessage = userMessages.get(userId);
              const otherUser =
                lastMessage.sender._id === currentUser._id
                  ? lastMessage.recipient
                  : lastMessage.sender;

              return {
                _id: `chat_${userId}`,
                participants: [currentUser, otherUser],
                lastMessage,
                updatedAt: lastMessage.createdAt,
                unreadCount: 0, // You might want to calculate this properly
              };
            });

            return {
              data: { conversations },
            };
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }

      // If we have users from the original response, use those
      return {
        data: {
          conversations: (response?.data?.users || []).map((user) => ({
            _id: `chat_${user._id}`,
            participants: [currentUser, user],
            lastMessage: user.lastMessage,
            updatedAt: user.lastMessage?.createdAt,
            unreadCount: user.unreadCount || 0,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return { data: { conversations: [] } };
    }
  },
};
