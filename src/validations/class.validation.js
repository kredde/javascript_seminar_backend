const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');
const { ISO_LANGUAGES } = require('../utils/constants');

const createClass = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    language: Joi.any()
      .allow(...Object.keys(ISO_LANGUAGES))
      .required(),
    subject: Joi.string().required(),
    level: Joi.number().max(10).min(1),
    topics: Joi.array().items(Joi.string())
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
    language: Joi.string().required().length(2),
    subject: Joi.string().required(),
    level: Joi.number().max(10).min(1),
    teacher: Joi.string(),
    students: Joi.array(),
    topics: Joi.array().items(Joi.string())
  })
};

const deleteClass = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId)
  })
};

module.exports = {
  createClass,
  getClass,
  updateClass,
  deleteClass
};
