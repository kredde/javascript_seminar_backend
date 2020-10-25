const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, notificationService } = require('../services');

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body);
  res.send(user);
});

const getNotifications = catchAsync(async (req, res) => {
  const notifications = await notificationService.getAllNotifications(req.user._id, 'notification');
  res.send(notifications);
});

const getNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId, req.user._id);
  res.send(notification);
});

const getStudents = catchAsync(async (req, res) => {
  const students = await userService.getStudents(req.user._id);
  res.send(students);
});

const getMeetings = catchAsync(async (req, res) => {
  const students = await userService.getMeetings(req.user);
  res.send(students);
});

module.exports = {
  getUser,
  updateUser,
  getNotifications,
  getNotification,
  getStudents,
  getMeetings
};
