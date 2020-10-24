const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');
const { ISO_LANGUAGES, ISO_COUNTRIES, LANGUAGE_LEVELS } = require('../utils/constants');

const createClass = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    language: Joi.any()
      .allow(...Object.keys(ISO_LANGUAGES))
      .required(),
    country: Joi.any().allow(...ISO_COUNTRIES.map((country) => country.code)),
    projectDuration: Joi.number(),
    meetingFrequency: Joi.number(),
    subject: Joi.string().required(),
    level: Joi.number().max(10).min(1),
    topics: Joi.array().items(Joi.string()),
    languageLevel: Joi.any().allow(...LANGUAGE_LEVELS)
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
    id: Joi.string(),
    name: Joi.string().required(),
    language: Joi.any()
      .allow(...Object.keys(ISO_LANGUAGES))
      .required(),
    country: Joi.any().allow(...ISO_COUNTRIES.map((country) => country.code)),
    projectDuration: Joi.number(),
    meetingFrequency: Joi.number(),
    subject: Joi.string().required(),
    level: Joi.number().max(10).min(1),
    teacher: Joi.string(),
    students: Joi.array(),
    topics: Joi.array().items(Joi.string()),
    languageLevel: Joi.any().allow(...LANGUAGE_LEVELS)
  })
};

const deleteClass = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId)
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
    studentId: Joi.string().custom(objectId)
  })
};

const removeStudent = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId),
    studentId: Joi.string().custom(objectId)
  })
};

module.exports = {
  createClass,
  getClass,
  updateClass,
  deleteClass,
  getStudents,
  addStudent,
  removeStudent
};
