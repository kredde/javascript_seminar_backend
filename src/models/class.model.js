const mongoose = require('mongoose');
const Subject = require('./enumerations/subject.model.js');
const { toJSON, paginate } = require('./plugins');

const classSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    language: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: Subject,
      required: true
    },
    teacher: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    },
    students: [{
      student: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
      }
    }]
  }
)

classSchema.plugin(toJSON);
/**
 * @typedef Class
 */

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
