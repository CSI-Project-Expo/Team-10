import { io, Socket } from "socket.io-client";

const SOCKET_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
).replace(/\/$/, "");

let socket: Socket | null = null;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Returns the singleton socket instance with auto-reconnection
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socket.on("connect", () => {
      connectionAttempts = 0;
      console.log("[Socket] Connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("[Socket] Disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      connectionAttempts++;
      console.error(`[Socket] Connection error (attempt ${connectionAttempts}):`, error.message);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
    });

    socket.on("reconnect_failed", () => {
      console.error("[Socket] Failed to reconnect after max attempts");
    });
  }

  return socket;
}

/**
 * Disconnects and clears the socket instance
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    connectionAttempts = 0;
  }
}

/**
 * Returns whether the socket is currently connected
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
