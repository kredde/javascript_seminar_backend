const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const messageSchema = mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: new Date()
  }
});

messageSchema.plugin(toJSON);

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
