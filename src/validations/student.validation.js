const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const getStudent = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    studentId: Joi.string().custom(objectId)
  })
};

const updateStudent = {
  body: Joi.object()
    .keys({
      password: Joi.string().custom(password),
      schoolName: Joi.string(),
      age: Joi.number(),
      hobbies: Joi.string(),
      notes: Joi.string(),
      proficiency_level: Joi.string()
    })
    .min(1)
};

const createStudent = {
  body: Joi.object()
    .keys({
      password: Joi.string(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required()
    })
    .min(1)
};

module.exports = {
  getStudent,
  updateStudent,
  createStudent
};
