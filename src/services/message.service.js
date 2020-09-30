const { Message } = require('../models');

const createMessage = async (messageBody) => {
  const date = new Date();
  const message = await Message.create({ ...messageBody, timestamp: date.now });
  return message;
};

module.exports = {
  createMessage
};
