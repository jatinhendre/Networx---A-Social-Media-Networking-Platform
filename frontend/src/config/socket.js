import { io } from "socket.io-client";

let socket;
const socketBaseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://networx-a-social-media-networking.onrender.com";

export const getSocket = (token) => {
  if (!token) return null;

  if (socket?.connected && socket.auth?.token === token) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(socketBaseURL, {
    auth: { token },
    transports: ["websocket", "polling"],
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;

  socket.disconnect();
  socket = null;
};
