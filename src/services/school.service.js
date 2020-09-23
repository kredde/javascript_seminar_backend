const httpStatus = require('http-status');
const { School } = require('../models');
const ApiError = require('../utils/ApiError');

const createSchool = async (schoolBody) => {
  const school = await School.create(schoolBody);
  return school;
};

const getSchools = async (sub) => {
  return School.find({ name: { $regex: sub } });
};

module.exports = {
  createSchool,
  getSchools
};
