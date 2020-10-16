const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const schoolSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

schoolSchema.plugin(toJSON);

/**
 * @typedef School
 */
const School = mongoose.model('School', schoolSchema);

module.exports = School;
