import { createContext, useContext, useState, useEffect } from 'react';
import { socketService } from '../api/socketService';
import { userAPI } from '../api/userAPI';
import { notificationAPI } from '../api/notificationAPI';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);

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
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message || 
                   'An error occurred';
    throw new Error(message);
  };

  // Initialize user session
  useEffect(() => {
    const initializeSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await userAPI.getProfile().then(processApiResponse);
          setUser(userData);
          
          // Load initial notifications
          const notificationsData = await notificationAPI.getNotifications()
            .then(processApiResponse);
          setNotifications(notificationsData?.notifications || []);
          
        } catch (error) {
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
          }
          handleApiError(error);
        }
      }
      setLoading(false);
    };

    initializeSession();
  }, []);

  // Handle socket connections and events
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      socketService.connect(token);

      // Chat events
      socketService.on('chat:message:new', (message) => {
        if (message.sender._id !== user._id) {
          setUnreadMessages(prev => prev + 1);
        }
      });

      socketService.on('chat:message:read', ({ messageId, readBy }) => {
        if (readBy === user._id) {
          setUnreadMessages(prev => Math.max(0, prev - 1));
        }
      });

      // Notification events
      socketService.on('notification:new', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });

      socketService.on('notification:read', (notificationId) => {
        setNotifications(prev => 
          prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
        );
      });

      socketService.on('notification:allRead', () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      });

    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [user]);

  const login = async (credentials) => {
    try {
      const response = await userAPI.login(credentials);
      const data = processApiResponse(response);
      
      // Set user based on backend response structure
      const user = data.user || {
        _id: data._id,
        username: data.username,
        email: data.email,
        phone_number: data.phone_number,
        photo_url: data.photo_url
        // Add other properties from your user schema
      };
      socketService.connect();
      setUser(user);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const logout = async () => {
    try {
      await userAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setNotifications([]);
      setUnreadMessages(0);
      localStorage.removeItem('token');
      socketService.disconnect();
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = await userAPI.updateProfile(userData)
        .then(processApiResponse);
      setUser(prev => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } catch (error) {
      handleApiError(error);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
    updateUser,
    markNotificationRead,
    markAllNotificationsRead
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};