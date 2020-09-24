const config = require('../config/config');

module.exports = (data) => ({
  register: {
    title: 'Welcome to Globy',
    text: "We're glad you're here! Get started by creating your first class.",
    cta: {
      text: 'Login',
      url: `${config.frontendHost}/login`
    },
    type: 'email'
  },
  forgotPassword: {
    title: 'Reset password',
    text:
      ' To reset your password, click on the following link. If you did not request any password resets, then ignore this email.',
    cta: {
      text: 'Reset password',
      url: `${config.frontendHost}?token=${data}`
    },
    type: 'email'
  }
});
