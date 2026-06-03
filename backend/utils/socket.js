import { Server } from 'socket.io';
import { resolveUserFromToken } from '../middleware/auth.middleware.js';
import Conversation from '../models/conversations.model.js';
import Message from '../models/messages.model.js';

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

    // Join user to their conversation rooms
    socket.on('join_conversations', async () => {
      try {
        const conversations = await Conversation.find({
          participants: userId,
        }).select('_id');

        conversations.forEach((conv) => {
          socket.join(`conversation:${conv._id}`);
        });
      } catch (error) {
        console.error('Error joining conversations:', error);
      }
    });

    // Listen for new messages
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content } = data;

        // Verify user is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        const isParticipant = conversation.participants.some(
          (p) => p.toString() === userId.toString()
        );
        if (!isParticipant) {
          socket.emit('error', { message: 'You are not a participant' });
          return;
        }

        // Create message
        const message = new Message({
          conversationId,
          senderId: userId,
          content,
        });

        await message.save();
        await message.populate('senderId', 'username name profilePicture');

        // Update conversation
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        conversation.updatedAt = new Date();
        await conversation.save();

        // Emit to all participants in the conversation
        io.to(`conversation:${conversationId}`).emit('message_received', {
          conversationId,
          message: message.toObject(),
        });

        // Notify other participants about new conversation activity
        const otherParticipant = conversation.participants.find(
          (p) => p.toString() !== userId.toString()
        );
        if (otherParticipant) {
          io.to(`user:${otherParticipant}`).emit('conversation_updated', {
            conversationId,
            lastMessage: message.toObject(),
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Listen for read receipts
    socket.on('mark_as_read', async (data) => {
      try {
        const { conversationId } = data;

        // Verify user is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        const isParticipant = conversation.participants.some(
          (p) => p.toString() === userId.toString()
        );
        if (!isParticipant) {
          socket.emit('error', { message: 'You are not a participant' });
          return;
        }

        // Mark messages as read
        await Message.updateMany(
          {
            conversationId,
            senderId: { $ne: userId },
            isRead: false,
          },
          {
            isRead: true,
            readAt: new Date(),
          }
        );

        // Notify all participants
        io.to(`conversation:${conversationId}`).emit('messages_read', {
          conversationId,
          readBy: userId,
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
        socket.emit('error', { message: 'Failed to mark as read' });
      }
    });

    // Handle new conversation creation
    socket.on('new_conversation', async (data) => {
      try {
        const { otherUserId } = data;

        const conversation = await Conversation.findOne({
          participants: { $all: [userId, otherUserId] },
        }).populate('participants', 'username name profilePicture');

        if (conversation) {
          // Notify other user about new conversation
          io.to(`user:${otherUserId}`).emit('conversation_started', {
            conversation,
          });
        }
      } catch (error) {
        console.error('Error handling new conversation:', error);
      }
    });

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

