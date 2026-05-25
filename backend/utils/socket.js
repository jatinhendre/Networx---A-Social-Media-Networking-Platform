import { Server } from 'socket.io';
import { resolveUserFromToken } from '../middleware/auth.middleware.js';

let io;

const connectedUsers = new Map();

const addUserSocket = (userId, socketId) => {
  const key = userId.toString();
  const sockets = connectedUsers.get(key) || new Set();
  sockets.add(socketId);
  connectedUsers.set(key, sockets);
};

const removeUserSocket = (userId, socketId) => {
  const key = userId.toString();
  const sockets = connectedUsers.get(key);

  if (!sockets) return;

  sockets.delete(socketId);

  if (sockets.size === 0) {
    connectedUsers.delete(key);
  }
};

const getSocketToken = (socket) => {
  const authToken = socket.handshake.auth?.token;
  const queryToken = socket.handshake.query?.token;
  const bearerToken = socket.handshake.headers?.authorization?.startsWith('Bearer ')
    ? socket.handshake.headers.authorization.slice(7)
    : null;

  return authToken || queryToken || bearerToken || null;
};

export const initializeSocket = (server, corsOptions) => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.use(async (socket, next) => {
    try {
      const token = getSocketToken(socket);
      const user = await resolveUserFromToken(token);

      if (!user) {
        return next(new Error('Unauthorized'));
      }

      socket.user = user;
      socket.authToken = token;
      return next();
    } catch (error) {
      return next(error);
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id;

    addUserSocket(userId, socket.id);
    socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      removeUserSocket(userId, socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }

  return io;
};

export const emitToUser = (userId, eventName, payload) => {
  if (!io || !userId) return false;

  io.to(`user:${userId}`).emit(eventName, payload);
  return true;
};

export const isUserOnline = (userId) => {
  if (!userId) return false;
  return connectedUsers.has(userId.toString());
};

export const getConnectedUserIds = () => {
  return Array.from(connectedUsers.keys());
};

