const { Message } = require('../models');
const logger = require('../config/logger');

const createMessage = async (messageBody) => {
  const date = new Date();
  const message = await Message.create({ ...messageBody, timestamp: date.now });
  logger.info(message._id);
  return message;
};

module.exports = {
  createMessage
};
