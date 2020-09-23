const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const projectSchema = mongoose.Schema({
  firstClass: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Class'
  },
  secondClass: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Class'
  },
  state: {
    type: String,
    enum: ['pending', 'accepted']
  },
  messages: [],
  meetings: []
});

projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

/**
 * @typedef Project
 */
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
