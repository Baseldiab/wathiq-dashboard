// services/socket.js
import { io } from "socket.io-client";

let socket;

export function getSocket(options = {}) {
  // If the socket is already created, return it
  if (socket) return socket;

  // Advanced configuration options with defaults
  const defaultConfig = {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 2000, // يزيد الفاصل بين المحاولات
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
    query: {},
    ...options,
  };
  console.log("Creating socket with config:", defaultConfig);

  // Create socket with advanced configuration
  socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, defaultConfig);

  // Connection events
  socket.on("connect", () => {
    console.log("Connected to the server:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  let failedAttempts = 0;
  socket.on("connect_error", (err) => {
    console.error("Connect error:", err.message);
    failedAttempts++;
    if (failedAttempts >= 3) {
      console.warn("Too many failed attempts, stopping socket.");
      socket.disconnect();
    }
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`);
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`Reconnection attempt: ${attemptNumber}`);
  });

  socket.on("reconnect_error", (error) => {
    console.error("Reconnection error:", error);
  });

  socket.on("reconnect_failed", () => {
    console.error("Failed to reconnect");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return socket;
}

// Utility methods for socket management
export const socketUtils = {
  disconnect: () => {
    if (socket) {
      socket.disconnect();
    }
  },

  reconnect: () => {
    if (socket) {
      socket.connect();
    }
  },

  // Emit an event with acknowledgement (promise-based)
  emitWithAck: (event, data) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket not initialized"));
        return;
      }

      socket.emit(event, data, (response) => {
        if (response && response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  },
};
