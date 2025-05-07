export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",

  // Notification events
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_CLEAR: "notification:clear",

  // Chat events
  CHAT_MESSAGE: "chat:message",
  CHAT_TYPING: "chat:typing",
  CHAT_READ: "chat:read",

  // Bread post events
  BREAD_CREATED: "bread:created",
  BREAD_UPDATED: "bread:updated",
  BREAD_DELETED: "bread:deleted",
  BREAD_RESERVED: "bread:reserved",
  BREAD_CANCELED: "bread:canceled",
  BREAD_COMPLETED: "bread:completed",
  BREAD_EXPIRED: "bread:expired",

  // Location events
  LOCATION_UPDATE: "location:update",
  LOCATION_NEARBY: "location:nearby",

  // User events
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
  USER_ACTIVITY: "user:activity",

  CHAT_MESSAGE_NEW: 'chat:message:new',
  CHAT_MESSAGE_READ: 'chat:message:read',
  CHAT_TYPING: 'chat:typing',
};
