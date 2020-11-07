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

roomSchema.pre('save', async function (next) {
  const room = this;
  if (room.isModified('attendeePW')) {
    room.attendeePW = await jwt.sign(room.attendeePW, config.jwt.secret);
  }

  if (room.isModified('moderatorPW')) {
    room.moderatorPW = await jwt.sign(room.moderatorPW, config.jwt.secret);
  }
  next();
});

roomSchema.pre('findOne', async function (next) {
  const room = this;
  if (room.isModified('attendeePW')) {
    room.attendeePW = await jwt.verify(room.attendeePW, config.jwt.secret);
  }

  if (room.isModified('moderatorPW')) {
    room.moderatorPW = await jwt.verify(room.moderatorPW, config.jwt.secret);
  }
  next();
});

roomSchema.pre('findAll', async function (next) {
  const room = this;
  if (room.isModified('attendeePW')) {
    room.attendeePW = await jwt.verify(room.attendeePW, config.jwt.secret);
  }

  if (room.isModified('moderatorPW')) {
    room.moderatorPW = await jwt.verify(room.moderatorPW, config.jwt.secret);
  }
  next();
});

roomSchema.plugin(toJSON);

/**
 * @typedef Room
 */
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
