const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const config = require('../config/config');

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
  }
});

roomSchema.plugin(toJSON);

/**
 * @typedef Room
 */
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
