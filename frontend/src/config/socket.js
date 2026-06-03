import { io } from "socket.io-client";

let socket;

export const getSocket = (token) => {
  if (!token) return null;

  if (socket?.connected && socket.auth?.token === token) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(process.env.NEXT_PUBLIC_API_URL, {
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

