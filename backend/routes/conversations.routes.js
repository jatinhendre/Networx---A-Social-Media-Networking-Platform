import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getConversations,
  findOrCreateConversation,
  getMessages,
  sendMessage,
  markConversationAsRead,
  getUnreadCount,
} from '../controllers/conversations.controller.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get all conversations for current user
router.get('/conversations', getConversations);

// Get unread message count
router.get('/conversations/unread/count', getUnreadCount);

// Find or create a conversation between two users
router.post('/conversations', findOrCreateConversation);

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', getMessages);

// Send a message to a conversation
router.post('/conversations/:conversationId/messages', sendMessage);

// Mark conversation as read
router.put('/conversations/:conversationId/read', markConversationAsRead);

export default router;
