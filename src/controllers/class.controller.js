const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { classService } = require('../services');

const createClass = catchAsync(async (req, res) => {
  const _class = await classService.createClass({...req.body});
  res.send({_class});
});

const getClass = catchAsync(async (req, res) => {
  const _class = await classService.getClassById(req.class._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  res.send(_class);
})

module.exports = {
  createClass,
  getClass
};
