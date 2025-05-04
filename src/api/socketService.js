import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io("http://localhost:5000", {
      auth: {
        token,
      },
    });

    this.socket.on("connect", () => {
      this.connected = true;
      console.log("Socket connected");
    });

    this.socket.on("disconnect", () => {
      this.connected = false;
      console.log("Socket disconnected");
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
      this.connected = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  onNotification(callback) {
    if (!this.socket) return;
    this.socket.on("notification", callback);
  }

  onMessage(callback) {
    if (!this.socket) return;
    this.socket.on("message", callback);
  }

  onUserOnline(callback) {
    if (!this.socket) return;
    this.socket.on("user:online", callback);
  }

  onUserOffline(callback) {
    if (!this.socket) return;
    this.socket.on("user:offline", callback);
  }

  onPostReserved(callback) {
    if (!this.socket) return;
    this.socket.on("post:reserved", callback);
  }

  onReservationCancelled(callback) {
    if (!this.socket) return;
    this.socket.on("post:unreserved", callback);
  }

  emitTyping(recipientId, isTyping = true) {
    if (!this.socket) return;
    this.socket.emit("chat:typing", { recipientId, isTyping });
  }

  onTyping(callback) {
    if (!this.socket) return;
    this.socket.on("chat:typing", callback);
  }

  joinRoom(roomId) {
    if (!this.socket) return;
    this.socket.emit("room:join", roomId);
  }

  leaveRoom(roomId) {
    if (!this.socket) return;
    this.socket.emit("room:leave", roomId);
  }

  removeAllListeners() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }

  isConnected() {
    return this.connected;
  }
}

export const socketService = new SocketService();
