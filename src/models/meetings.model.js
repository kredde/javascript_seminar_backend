const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const meetingSchema = mongoose.Schema({
  project: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Project'
  },
  date: {
    type: Date,
    required: true
  },
  groupAssignment: {
    type: String,
    enum: ['tandem', 'group3', 'group4', 'whole_class'],
    required: true
  },
  groups: [
    {
      participants: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
      room: { type: mongoose.Schema.ObjectId, ref: 'Room' }
    }
  ],
  taskList: [String],
  duration: Number
});

meetingSchema.plugin(toJSON);

/**
 * @typedef Meeting
 */
const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
