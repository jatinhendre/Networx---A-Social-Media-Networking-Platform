import { Router } from 'express';
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../controllers/notifications.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/notifications').get(requireAuth, getNotifications);
router.route('/notifications/unread-count').get(requireAuth, getUnreadNotificationCount);
router.route('/notifications/read-all').post(requireAuth, markAllNotificationsAsRead);
router.route('/notifications/:id/read').post(requireAuth, markNotificationAsRead);
router.route('/notifications/:id').delete(requireAuth, deleteNotification);

export default router;

