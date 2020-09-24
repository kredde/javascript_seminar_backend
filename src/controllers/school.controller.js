const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { schoolService } = require('../services');

const createSchool = catchAsync(async (req, res) => {
  const school = await schoolService.createSchool(req.body);
  res.send(school);
});

const getSchool = catchAsync(async (req, res) => {
  const school = await schoolService.getSchoolById(req.params.schoolId);
  if (!school) {
    throw new ApiError(httpStatus.NOT_FOUND, 'School not found');
  }
  res.send(school);
});

const getSchools = catchAsync(async (req, res) => {
  const schools = await schoolService.getSchools(req.query.name);
  res.send(schools);
});

module.exports = {
  createSchool,
  getSchool,
  getSchools
};
