const Joi = require('@hapi/joi');
const Subject = require('../models/enumerations/subject.model');
const { objectId } = require('./custom.validation');

const createClass = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    language: Joi.string().required(),
    subject: Joi.string().valid(...Object.values(Subject))
  })
};

const getClass = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId)
  })
};

const updateClass = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    language: Joi.string(),
    subject: Joi.string().valid(...Object.values(Subject))
  })
};

const deleteClass = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId)
  })
};

const getAllClasses = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

const getStudents = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId)
  })
};

const addStudent = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId)
  })
};

const removeStudent = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId)
  })
};

module.exports = {
  createClass,
  getClass,
  updateClass,
  deleteClass,
  getAllClasses,
  getStudents,
  addStudent,
  removeStudent
};
