import Notification from '../models/notifications.model.js';
import { emitToUser } from '../utils/socket.js';

export const createNotification = async ({
  recipientUserId,
  actorUserId,
  type,
  entityType,
  entityId,
  title,
  body = '',
  metadata = {},
}) => {
  try {
    if (!recipientUserId || !actorUserId) return null;

    if (recipientUserId.toString() === actorUserId.toString()) {
      return null;
    }

    const notification = await Notification.create({
      recipientUserId,
      actorUserId,
      type,
      entityType,
      entityId,
      title,
      body,
      metadata,
    });

    const [populatedNotification, unreadCount] = await Promise.all([
      Notification.findById(notification._id)
        .populate('actorUserId', 'name username profilePicture')
        .lean(),
      Notification.countDocuments({
        recipientUserId,
        read: false,
      }),
    ]);

    emitToUser(recipientUserId, 'notification:new', populatedNotification);
    emitToUser(recipientUserId, 'notification:unread_count', { unreadCount });

    return populatedNotification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
};
