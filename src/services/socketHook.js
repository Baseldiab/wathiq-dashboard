import { useState, useEffect, useCallback } from "react";
import { getSocket, socketUtils } from "./socket";

export const useSocketListener = (socketEvent, options = {}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const socket = getSocket(options);

    // Update connection state
    setIsConnected(socket.connected);
    if (socket.connected) {
      setSocketId(socket.id);
    }

    // Connection status handlers
    const onConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id);
      setError(null);
    };

    const onDisconnect = (reason) => {
      setIsConnected(false);
      setSocketId(null);
      if (reason === "io server disconnect") {
        // Server disconnected the client, reconnect manually
        socket.connect();
      }
    };

    let reconnectCount = 0;

    const onConnectError = (err) => {
      setError(err);
      setIsConnected(false);
      reconnectCount += 1;

      if (reconnectCount >= 3) {
        console.warn("⚠️ Too many reconnect attempts, disconnecting socket.");
        socket.disconnect(); // Prevent infinite loop
      }
    };

    // Event handler for the specific socket message
    const onEventReceived = (data) => {
      if (data && data.error) {
        setError(data);
      } else {
        setResponse(data);
      }
    };

    // Register event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on(socketEvent, onEventReceived);

    // Cleanup on unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off(socketEvent, onEventReceived);
    };
  }, [socketEvent, options]);

  // Emit event with data and handle acknowledgment
  const emitEvent = useCallback((event, data) => {
    return socketUtils.emitWithAck(event, data);
  }, []);

  return {
    response,
    error,
    isConnected,
    socketId,
    emitEvent,
    reconnect: socketUtils.reconnect,
    disconnect: socketUtils.disconnect,
  };
};

// Custom hook for emitting events
export const useSocketEmitter = () => {
  const emitEvent = useCallback((event, data) => {
    return socketUtils.emitWithAck(event, data);
  }, []);

  return { emitEvent };
};
