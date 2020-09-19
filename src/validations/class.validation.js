const Joi = require('@hapi/joi');
const Subject = require('../models/enumerations/subject.model');

const createClass = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    language: Joi.string().required(),
    subject: Joi.string().valid(...Object.values(Subject))
  })
}

module.exports = {
   createClass
};
