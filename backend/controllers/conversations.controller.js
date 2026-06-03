import Conversation from '../models/conversations.model.js';
import Message from '../models/messages.model.js';
import User from '../models/users.model.js';
import { emitToUser } from '../utils/socket.js';

/**
 * Get all conversations for the current user
 * Sorted by most recent activity
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('participants', 'username name profilePicture')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 })
      .lean();

    return res.status(200).json({
      message: 'Conversations fetched successfully',
      conversations,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching conversations',
      error: error.message,
    });
  }
};

/**
 * Find or create a conversation between two users
 * Access: Only the two participants can create/access this conversation
 */
export const findOrCreateConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ message: 'otherUserId is required' });
    }

    if (userId.toString() === otherUserId) {
      return res
        .status(400)
        .json({ message: 'Cannot create conversation with yourself' });
    }

    // Verify the other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    })
      .populate('participants', 'username name profilePicture')
      .populate('lastMessage');

    // Create new conversation if it doesn't exist
    if (!conversation) {
      conversation = new Conversation({
        participants: [userId, otherUserId],
      });
      await conversation.save();
      await conversation.populate('participants', 'username name profilePicture');
    }

    return res.status(200).json({
      message: 'Conversation found or created',
      conversation,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error finding or creating conversation',
      error: error.message,
    });
  }
};

/**
 * Get all messages for a conversation
 * Access: Only participants of the conversation can view messages
 */
export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // Check access: user must be a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({
        message: 'You do not have access to this conversation',
      });
    }

    // Fetch messages with pagination
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'username name profilePicture')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    // Reverse to get chronological order for display
    const messagesInOrder = messages.reverse();

    return res.status(200).json({
      message: 'Messages fetched successfully',
      messages: messagesInOrder,
      total: await Message.countDocuments({ conversationId }),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching messages',
      error: error.message,
    });
  }
};

/**
 * Send a message to a conversation
 * Access: Only participants can send messages
 */
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    // Check access: user must be a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({
        message: 'You do not have access to this conversation',
      });
    }

    // Create message
    const message = new Message({
      conversationId,
      senderId: userId,
      content: content.trim(),
      attachment: req.file
        ? {
            url: req.file.path,
            publicId: req.file.filename,
            type: req.file.mimetype.split('/')[0], // 'image', 'video', 'application'
          }
        : undefined,
    });

    await message.save();
    await message.populate('senderId', 'username name profilePicture');

    // Update conversation's lastMessage and lastMessageAt
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    conversation.updatedAt = new Date();
    await conversation.save();

    const otherParticipants = conversation.participants
      .map((participant) => participant.toString())
      .filter((participantId) => participantId !== userId.toString());

    otherParticipants.forEach((participantId) => {
      emitToUser(participantId, 'message_received', {
        conversationId,
        message: message.toObject(),
      });

      emitToUser(participantId, 'conversation_updated', {
        conversationId,
        lastMessage: message.toObject(),
      });
    });

    return res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error sending message',
      error: error.message,
    });
  }
};

/**
 * Mark all messages in a conversation as read
 * Access: Only participants can mark messages as read
 */
export const markConversationAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    // Check access: user must be a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({
        message: 'You do not have access to this conversation',
      });
    }

    // Mark messages as read (only messages not sent by current user)
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

    return res.status(200).json({
      message: 'Conversation marked as read',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error marking conversation as read',
      error: error.message,
    });
  }
};

/**
 * Get unread message count for a user
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadConversationIds = await Message.aggregate([
      {
        $match: {
          senderId: { $ne: userId },
          isRead: false,
        },
      },
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversationId',
          foreignField: '_id',
          as: 'conversation',
        },
      },
      {
        $match: {
          'conversation.participants': userId,
        },
      },
      {
        $group: {
          _id: '$conversationId',
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json({
      message: 'Unread count fetched',
      unreadCount: unreadConversationIds.length,
      unreadConversationIds: unreadConversationIds.map((item) => item._id),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching unread count',
      error: error.message,
    });
  }
};
