const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const roomSchema = mongoose.Schema({
  meetingId: {
    type: String,
    required: true
  },
  attendeePW: {
    type: String,
    required: true
  },
  moderatorPW: {
    type: String,
    required: true
  },
  ref: 'Room'
});

roomSchema.plugin(toJSON);

/**
 * @typedef Meeting
 */
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
