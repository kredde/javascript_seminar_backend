const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const projectSchema = mongoose.Schema({
  classes: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Class'
    }
  ],
  state: {
    type: String,
    enum: ['pending', 'ongoing', 'done']
  },
  messages: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Message'
    }
  ],
  meetings: []
});

projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

/**
 * @typedef Project
 */
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
