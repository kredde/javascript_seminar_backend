const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { classService } = require('../services');

const createClass = catchAsync(async (req, res) => {
  if (req.user.role === 'teacher') {
    const _class = await classService.createClass({ ...req.body, teacher: req.user._id });
    res.send(_class);
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED);
  }
});

const getClass = catchAsync(async (req, res) => {
  const _class = await classService.getClassById(req.param.classId);
  if (!_class) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  res.send(_class);
});

const updateClass = catchAsync(async (req, res) => {
  const _class = await classService.updateUserById(req.param.classId, req.body);
  res.send(_class);
});

const deleteClass = catchAsync(async (req, res) => {
  const _class = await classService.deleteClassById(req.param.classId);
  res.send(_class);
});

module.exports = {
  createClass,
  getClass,
  updateClass,
  deleteClass
};
