const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createSchool = {
  body: Joi.object().keys({
    name: Joi.string().required()
  })
};

const getSchool = {
  params: Joi.object().keys({
    schoolId: Joi.string().custom(objectId)
  })
};

const getSchools = {
  params: Joi.object().keys({
    subs: Joi.string()
  })
};

module.exports = {
  createSchool,
  getSchool,
  getSchools
};
