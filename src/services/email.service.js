const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');

const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);

/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() =>
      logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env')
    );
}

// "send: true" for sending in dev env
const email = new Email({ message: { from: config.email.from }, transport });

/**
 * Send an email
 *
 * @param {String} to
 * @param {Notification} subject
 * @returns {Promise}
 */
const sendEmail = async (to, notification) => {
  return email.send({
    template: path.join(__dirname, '..', 'templates', 'action'),
    message: {
      to
    },
    locals: {
      subject: notification.title,
      title: notification.title,
      body: notification.text,
      buttonText: notification.cta && notification.cta.text,
      link: notification.cta && notification.cta.url,
      frontendHost: config.frontendHost
    }
  });
};

module.exports = {
  transport,
  sendEmail
};
