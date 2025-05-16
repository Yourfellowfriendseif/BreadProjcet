import { createContext, useContext, useState, useEffect } from "react";
import { socketService } from "../api/socketService";
import { userAPI } from "../api/userAPI";
import { notificationAPI } from "../api/notificationAPI";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const processApiResponse = (response) => {
    // Handle different backend response structures
    if (response?.data?.data) {
      return response.data.data; // For nested data responses
    }
    if (response?.data) {
      return response.data; // For most auth responses
    }
    return response; // If data is at root level
  };

  const handleApiError = (error) => {
    const message =
      error.response?.data?.message ||
                   error.response?.data?.error || 
                   error.message || 
      "An error occurred";
    throw new Error(message);
  };

  // Initialize user session
  useEffect(() => {
    const initializeSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          console.log("Found token in localStorage, initializing session...");
          const userData = await userAPI.getProfile();

          if (userData) {
            console.log("Successfully loaded user profile");
          setUser(userData);
          
          // Load initial notifications
            try {
              const notificationsData = await notificationAPI
                .getNotifications()
            .then(processApiResponse);
          setNotifications(notificationsData?.notifications || []);
            } catch (notifError) {
              console.error("Error loading notifications:", notifError);
            }
          } else {
            console.warn("No user data returned despite valid token");
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Error initializing session:", error);
          if (error.response?.status === 401) {
            console.warn(
              "Token expired or invalid, removing from localStorage"
            );
            localStorage.removeItem("token");
          }
        }
      }
      setLoading(false);
    };

    initializeSession();
  }, []);

  // Handle socket connections and events
  useEffect(() => {
    let isMounted = true;

    const setupSocket = async () => {
    if (user) {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("User is set but no token found");
          return;
        }

        try {
          console.log(
            "Setting up socket connection with token:",
            token.substring(0, 10) + "..."
          );

          // First verify the token with the server
          await userAPI.getProfile();

          // Then connect socket - exactly like the HTML test
      socketService.connect(token);

          if (isMounted) {
      // Chat events
            socketService.on("chat:message:new", (message) => {
              console.log("Socket received new message:", message);
        if (message.sender._id !== user._id) {
                setUnreadMessages((prev) => prev + 1);
        }
      });

            socketService.on("chat:message:read", ({ messageId, readBy }) => {
              console.log("Socket received message read:", {
                messageId,
                readBy,
              });
        if (readBy === user._id) {
                setUnreadMessages((prev) => Math.max(0, prev - 1));
        }
      });

      // Notification events
            socketService.on("notification:new", (notification) => {
              console.log("Socket received new notification:", notification);
              setNotifications((prev) => [notification, ...prev]);
      });

            socketService.on("notification:read", (data) => {
              console.log("Socket received notification read:", data);
              const notificationId = data.notificationId;
              setNotifications((prev) =>
                prev.map((n) =>
                  n._id === notificationId ? { ...n, read: true } : n
                )
        );
      });

            socketService.on("notification:allRead", () => {
              console.log("Socket received all notifications read");
              setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
              );
      });
          }
        } catch (error) {
          console.error("Error setting up socket in AppContext:", error);
        }
    } else {
        // Make sure socket is disconnected when no user
      socketService.disconnect();
    }
    };

    setupSocket();

    // Properly clean up socket listeners when component unmounts or user changes
    return () => {
      isMounted = false;
      socketService.removeAllListeners();
    };
  }, [user]);

  const login = async (credentials) => {
    try {
      const response = await userAPI.login(credentials);
      const data = processApiResponse(response);

      // Make sure token is saved first
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Set user based on backend response structure
      const user = data.user || {
        _id: data._id,
        username: data.username,
        email: data.email,
        phone_number: data.phone_number,
        photo_url: data.photo_url,
        // Add other properties from your user schema
      };
      setUser(user);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const register = async (userData) => {
    try {
      const response = await userAPI.register(userData);
      const data = processApiResponse(response);

      // Make sure token is saved first
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Set user based on backend response structure
      const user = data.user || {
        _id: data._id,
        username: data.username,
        email: data.email,
        phone_number: data.phone_number,
        photo_url: data.photo_url,
      };
      setUser(user);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const logout = async () => {
    try {
      // Disconnect socket first to avoid cleanup issues
      socketService.disconnect();

      await userAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setNotifications([]);
      setUnreadMessages(0);
      localStorage.removeItem("token");
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = await userAPI
        .updateProfile(userData)
        .then(processApiResponse);
      setUser((prev) => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } catch (error) {
      handleApiError(error);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      handleApiError(error);
    }
  };

  const value = {
    user,
    loading,
    notifications,
    unreadMessages,
    login,
    logout,
    register,
    updateUser,
    markNotificationRead,
    markAllNotificationsRead,
    globalSearchTerm,
    setGlobalSearchTerm,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
