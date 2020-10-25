const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string()
  })
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

const updateUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      schoolName: Joi.string()
    })
    .min(1)
};

const getNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId)
  })
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  getNotification
};
