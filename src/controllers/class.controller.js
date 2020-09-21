const mongoose = require('mongoose');
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
  const _class = await classService.getClassById(req.params.classId);
  if (!_class) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  res.send(_class);
});

const updateClass = catchAsync(async (req, res) => {
  const _class = await classService.updateClassById(req.params.classId, req.body);
  res.send(_class);
});

const deleteClass = catchAsync(async (req, res) => {
  const _class = await classService.deleteClassById(req.params.classId);
  res.send(_class);
});

const getAllClasses = catchAsync(async (req, res) => {
  const _classes = await classService.getAllClasses(req.user._id);
  res.send(_classes);
});

module.exports = {
  createClass,
  getClass,
  updateClass,
  deleteClass,
  getAllClasses
};
