import { createContext, useContext, useState, useEffect } from 'react';
import { socketService } from '../api/socketService';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user) {
      // Connect socket when user logs in
      socketService.connect(localStorage.getItem('token'));
      
      // Setup notification listener
      socketService.onNotification((notification) => {
        setNotifications(prev => [notification, ...prev]);
      });

      // Setup chat message listener
      socketService.onChatMessage(() => {
        setUnreadMessages(prev => prev + 1);
      });

      // Setup post status change listener
      socketService.onPostStatusChange((update) => {
        // Handle post status updates
        // This will be used to update UI when posts are reserved/unreserved
      });
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [user]);

  const value = {
    user,
    setUser,
    notifications,
    setNotifications,
    unreadMessages,
    setUnreadMessages
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