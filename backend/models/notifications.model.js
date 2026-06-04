import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  actorUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'like',
      'comment',
      'connection_request',
      'connection_accepted',
      'connection_rejected',
      'message',
    ],
    required: true,
  },
  entityType: {
    type: String,
    enum: ['Post', 'Comment', 'Connection', 'Conversation', 'Message'],
    required: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    default: '',
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

notificationSchema.index({ recipientUserId: 1, createdAt: -1 });
notificationSchema.index({ recipientUserId: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

