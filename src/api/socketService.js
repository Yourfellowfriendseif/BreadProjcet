import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./socketEvents";

class SocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map(); // Keep track of all attached listeners
  }

  initialize(token) {
    if (this.socket && this.socket.connected) {
      console.log("Socket already connected, not reinitializing");
      return;
    }

    if (this.socket) {
      // Clean up existing socket if it exists but is not connected
      this.socket.disconnect();
      this.socket = null;
    }

    if (!token) {
      console.error("Cannot initialize socket: No token provided");
      return;
    }

    console.log("Initializing socket connection with token");

    try {
      // IMPORTANT: Using exact same URL and structure as the working test HTML
      this.socket = io("http://localhost:5000", {
        auth: { token },
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error("Error initializing socket:", error);
      this.socket = null;
    }
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected successfully");
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      if (error.message === "Authentication error") {
        console.warn("Socket authentication failed, disconnecting");
        this.disconnect();
      }
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
      if (error.message === "Authentication failed") {
        this.disconnect();
      }
    });
  }

  removeAllListeners() {
    if (!this.socket) {
      console.log("No socket to clean up listeners from");
      return;
    }

    try {
      // Clean up all listeners that we've tracked
      this.listeners.forEach((callback, event) => {
        if (Array.isArray(callback)) {
          callback.forEach((cb) => this.socket.off(event, cb));
        } else {
          this.socket.off(event, callback);
        }
      });

      // Also use native removeAllListeners as a fallback
      this.socket.removeAllListeners();

      // Clear our listener tracking
      this.listeners.clear();

      console.log("All socket listeners removed");
    } catch (err) {
      console.error("Error removing socket listeners:", err);
    }
  }

  connect(token) {
    if (!token) {
      console.warn("Cannot connect socket: No token provided");
      return;
    }

    try {
      if (!this.socket) {
        this.initialize(token);
      } else if (!this.socket.connected) {
        // Update auth token if socket exists but is disconnected
        this.socket.auth = { token };
        this.socket.connect();
      }
    } catch (error) {
      console.error("Error connecting socket:", error);
    }
  }

  disconnect() {
    if (this.socket) {
      // First remove all listeners to prevent any callbacks during disconnect
      this.removeAllListeners();

      // Then disconnect
      this.socket.disconnect();
      this.socket = null;

      console.log("Socket disconnected and reset");
    }
    this.reconnectAttempts = 0;
  }

  emit(event, data) {
    if (!this.socket) {
      console.log(`Cannot emit ${event}: Socket not initialized`);
      return;
    }
    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) {
      console.log(`Cannot listen to ${event}: Socket not initialized`);
      return;
    }

    // Track the listener
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [callback]);
    } else {
      const callbacks = this.listeners.get(event);
      callbacks.push(callback);
      this.listeners.set(event, callbacks);
    }

    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) {
      console.log(
        `Cannot remove listener for ${event}: Socket not initialized`
      );
      return;
    }

    // Remove from our tracking
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
        if (callbacks.length === 0) {
          this.listeners.delete(event);
        } else {
          this.listeners.set(event, callbacks);
        }
      }
    }

    this.socket.off(event, callback);
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  // Location-specific events
  updateLocation(location) {
    this.emit(SOCKET_EVENTS.LOCATION_UPDATE, location);
  }

  // Chat-specific events
  sendMessage(message) {
    this.emit(SOCKET_EVENTS.CHAT_MESSAGE, message);
  }

  sendTyping(chatId) {
    this.emit(SOCKET_EVENTS.CHAT_TYPING, { chatId });
  }

  markAsRead(chatId, messageIds) {
    this.emit(SOCKET_EVENTS.CHAT_READ, { chatId, messageIds });
  }

  // Bread-specific events
  notifyBreadCreated(bread) {
    this.emit(SOCKET_EVENTS.BREAD_CREATED, bread);
  }

  notifyBreadReserved(breadId, userId) {
    this.emit(SOCKET_EVENTS.BREAD_RESERVED, { breadId, userId });
  }

  // Chat event handlers
  onNewMessage(callback) {
    this.on(SOCKET_EVENTS.CHAT_MESSAGE_NEW, callback);
  }

  onMessageRead(callback) {
    this.on(SOCKET_EVENTS.CHAT_MESSAGE_READ, callback);
  }

  onTyping(callback) {
    this.on(SOCKET_EVENTS.CHAT_TYPING, callback);
  }

  emitTyping(userId, isTyping) {
    this.emit(SOCKET_EVENTS.CHAT_TYPING, { userId, isTyping });
  }

  // Notification-specific events
  onNewNotification(callback) {
    this.on(SOCKET_EVENTS.NOTIFICATION_NEW, callback);
  }

  onNotificationRead(callback) {
    this.on(SOCKET_EVENTS.NOTIFICATION_READ, callback);
  }

  // Handle notification updates
  markNotificationRead(notificationId) {
    this.emit(SOCKET_EVENTS.NOTIFICATION_MARK_READ, { notificationId });
  }

  markAllNotificationsRead() {
    this.emit(SOCKET_EVENTS.NOTIFICATION_MARK_ALL_READ);
  }
}

export const socketService = new SocketService();
