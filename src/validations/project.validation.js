const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createProject = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    class: Joi.string().custom(objectId).required()
  })
};

const updateProject = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId),
    projectId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
    state: Joi.string()
  })
};

const getProject = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId),
    projectId: Joi.string().custom(objectId)
  })
};

module.exports = {
  createProject,
  updateProject,
  getProject
};
