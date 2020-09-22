const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const classSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // TODO: create an enumeration
  language: {
    type: String,
    required: true
    // enum: [list, of language]
  },
  // TODO: create an enumeration
  subject: {
    type: String,
    required: true
    // enum: [list, of, subjects]
  },
  teacher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  students: [
    {
      student: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
      }
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
