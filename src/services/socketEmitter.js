// import { io } from "socket.io-client";

// export const socketEmitter = () => {
//   let socket = null; // Declare the socket variable in the correct scope

//   // Initialize the socket connection when needed
//   const initializeSocket = () => {
//     if (!socket || !socket.connected) {
//       socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, {
//         withCredentials: true, // Enable cookies if necessary
//         transports: ["websocket"], // Force WebSocket transport
//       });

//       socket.on("connect", () => {
//         console.log("Connected to the server:", socket.id);
//       });
//     }
//   };

//   // Emit the socket event and return a Promise
//   const emitEvent = (eventName, payload = null) => {
//     initializeSocket(); // Ensure socket is initialized

//     // Emit the event
//     socket.emit(eventName, payload);
//     socket.on("error", (error) => {
//       reject(error.message); // Reject the Promise on error
//     });
//     socket.on("disconnect", (error) => {
//       reject(error.message); // Reject the Promise on error
//     });
//   };

//   // Optionally: You can add a cleanup method to disconnect the socket when you're done
//   const disconnectSocket = () => {
//     if (socket) {
//       socket.disconnect();
//       console.log("Socket disconnected");
//     }
//   };

//   return { emitEvent, disconnectSocket };
// };

import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, {
  withCredentials: true, // Enable cookies if necessary
  transports: ["websocket"], // Force WebSocket transport
});

// Handle connection events once
socket.on("connect", () => {
  console.log("Connected to the server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

// Function to emit events
export const emitEvent = (eventName, payload = null) => {
  if (!socket || !socket.connected) {
    console.error("Socket is not connected.");
    return;
  }
  socket.emit(eventName, payload);
};

// Function to disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};

// Export the socket instance for direct usage
export { socket, };
