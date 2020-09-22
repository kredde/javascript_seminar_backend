const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const schoolSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

schoolSchema.plugin(toJSON);
schoolSchema.plugin(paginate);

/**
 * @typedef School
 */
const School = mongoose.model('School', schoolSchema);

module.exports = School;
