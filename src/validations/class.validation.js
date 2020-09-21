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

module.exports = {
  createClass,
  getClass
};
