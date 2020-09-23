const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createClass = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    language: Joi.string().required().length(2),
    subject: Joi.string()
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
    language: Joi.string().length(2),
    subject: Joi.string()
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
