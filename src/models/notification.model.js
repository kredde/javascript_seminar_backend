const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const notificationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  opened: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: new Date()
  },
  type: {
    type: String,
    enum: ['email', 'notification', 'all']
  },
  cta: {
    text: String,
    url: String
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }
});

notificationSchema.plugin(toJSON);

/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
