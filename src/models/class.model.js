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
    student: {
      type: String,
      trim: true,
      unique: true
    }
  }
)

/**
 * @typedef User
 */

const Class = mongoose.model('Class', classSchema);

module.export = Class;
