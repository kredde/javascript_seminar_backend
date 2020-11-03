const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createProject = {
  params: Joi.object().keys({
    classId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    class: Joi.string().custom(objectId).required(),
    initialMessage: Joi.string()
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

const getAllMessages = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId)
  })
};

const addMessage = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    message: Joi.string().required(),
    from: Joi.string().custom(objectId),
    to: Joi.string().custom(objectId)
  })
};

module.exports = {
  createProject,
  updateProject,
  getProject,
  getAllMessages,
  addMessage
};
