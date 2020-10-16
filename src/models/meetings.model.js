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
  groups: [[{ type: mongoose.Schema.ObjectId, ref: 'User' }]]
});

meetingSchema.plugin(toJSON);

/**
 * @typedef Meeting
 */
const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
