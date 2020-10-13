const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

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

const getStudents = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

module.exports = {
  getUser,
  updateUser,
  getNotification,
  getStudents
};
