const config = require('../config/config');

const register = {
  title: 'Welcome to Globy',
  text: "We're glad you're here! Get started by creating your first class.",
  cta: {
    text: 'Login',
    url: `${config.frontendHost}/login`
  },
  type: 'email'
};

const forgotPassword = (data) => ({
  title: 'Reset password',
  text:
    'To reset your password, click on the following link. If you did not request any password resets, then ignore this email.',
  cta: {
    text: 'Reset password',
    url: `${config.frontendHost}?token=${data}`
  },
  type: 'email'
});

const createProject = ({ teacher, teacherClass, otherClass }) => ({
  title: `Project invitation`,
  text: `${teacher.firstName} ${teacher.lastName} (${teacherClass.name}), has invited your class (${otherClass.name}) to join a project`,
  cta: {
    text: 'Accept invitation',
    url: `${config.frontendHost}/accept-invitation`
  },
  type: 'all'
});

const receiveMessage = (user, messageBody) => ({
  title: `You have received message from ${user.firstName} ${user.lastName}`,
  text: `${messageBody}`,
  cta: {
    text: 'Back',
    url: `${config.frontendHost}/See the message`
  },
  type: 'all'
})

const createStudentNotification = (token) => ({
  title: `Activate student account`,
  text: `Activate your new student account by clicking the following link`,
  cta: {
    text: `Click here to activate account`,
    url: `${config.frontendHost}/callback?token=${token}`
  },
  type: 'all'
});

module.exports = {
  register,
  forgotPassword,
  createProject,
  receiveMessage,
  createStudentNotification
};
