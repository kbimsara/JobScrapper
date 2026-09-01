import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  channel: { type: String },
  status: { type: String },
  messageId: { type: String },
  sentAt: { type: Date }
}, {
  timestamps: true,
  collection: 'notificationdeliveries'
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
