import Notification from '../models/notifications.model.js';

const getPagination = (req) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getNotifications = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipientUserId: req.user._id })
        .populate('actorUserId', 'name username profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ recipientUserId: req.user._id }),
      Notification.countDocuments({
        recipientUserId: req.user._id,
        read: false,
      }),
    ]);

    return res.status(200).json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + notifications.length < total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipientUserId: req.user._id,
      read: false,
    });

    return res.status(200).json({ unreadCount });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch unread notification count',
      error: error.message,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        recipientUserId: req.user._id,
      },
      { read: true },
      { new: true }
    ).populate('actorUserId', 'name username profilePicture');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        recipientUserId: req.user._id,
        read: false,
      },
      { read: true }
    );

    return res.status(200).json({
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to mark notifications as read',
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipientUserId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({
      message: 'Notification deleted',
      notificationId: id,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

