import { io } from "socket.io-client";
import { config } from "../utils/config";
import { storage } from "../utils/storage";
import { SOCKET_EVENTS } from "./socketEvents";

class SocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  initialize() {
    if (this.socket) return;

    const token = storage.getToken();

    this.socket = io(config.apiUrl, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log("Socket connected");
      this.reconnectAttempts = 0;
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error("Socket error:", error);
      if (error.message === "Authentication failed") {
        this.disconnect();
      }
    });

    this.socket.io.on("reconnect_attempt", () => {
      this.reconnectAttempts++;
      console.log(
        `Reconnect attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts}`
      );
    });

    this.socket.io.on("reconnect_failed", () => {
      console.log("Failed to reconnect to socket");
      this.disconnect();
    });
  }

  connect() {
    if (!this.socket) {
      this.initialize();
    }
    this.socket?.connect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
  }

  emit(event, data) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }
    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
    }
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return;
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
}

export const socketService = new SocketService();
