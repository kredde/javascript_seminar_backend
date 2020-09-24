const httpStatus = require('http-status');
const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService, emailService } = require('.');

const getNotificationById = async (id, user) => {
  const notification = await Notification.findOne({ _id: id, user });

  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  notification.opened = true;
  await notification.save();

  return notification;
};

const getAllNotifications = async (user, type) => {
  if (type) {
    return Notification.find({ user, type });
  }
  return Notification.find({ user });
};

const sendNotification = async (userId, body) => {
  const user = await userService.getUserById(userId);
  const notification = await Notification.create({ ...body, user: userId });

  const savedNotification = await notification.save();

  if (savedNotification.type === 'email' || savedNotification.type === 'all') {
    emailService.sendEmail(user.email, savedNotification);
  }
};

module.exports = {
  getNotificationById,
  getAllNotifications,
  sendNotification
};
