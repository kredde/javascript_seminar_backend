const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { ISO_LANGUAGES } = require('../utils/constants');

const languageCodes = Object.keys(ISO_LANGUAGES);

const classSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    enum: languageCodes
  },
  // TODO: create an enumeration
  subject: {
    type: String,
    required: true
    // enum: [list, of, subjects]
  },
  level: {
    type: Number,
    min: 1,
    max: 10
  },
  topics: [String],
  school: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'School'
  },
  teacher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  students: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    }
  ]
});

classSchema.plugin(toJSON);
classSchema.plugin(paginate);
/**
 * @typedef Class
 */

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
