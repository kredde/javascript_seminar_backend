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
      firstName: Joi.string(),
      lastName: Joi.string(),
      schoolName: Joi.string()
    })
    .min(1)
};

module.exports = {
  getUser,
  updateUser
};
