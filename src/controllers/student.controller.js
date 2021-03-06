const httpStatus = require('http-status');
// const { v4 } = require('uuid');

const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { createStudentNotification } = require('../utils/notifications');
const { userService, tokenService, notificationService, studentService } = require('../services');

const createStudent = catchAsync(async (req, res) => {
  const student = await userService.createUser({
    ...req.body,
    role: 'student',
    createdBy: req.user.id
    // TODO remove later
    // password: v4()
  });
  const tokens = await tokenService.generateAuthTokens(student);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  const receiverNotification = createStudentNotification(tokens, resetPasswordToken);
  await notificationService.sendNotification(student._id, receiverNotification);
  res.status(httpStatus.CREATED).send({ student, tokens });
});

const getStudent = catchAsync(async (req, res) => {
  const student = await studentService.getStudent(req.user._id, req.params.studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  res.send(student);
});

const updateStudent = catchAsync(async (req, res) => {
  const student = await studentService.updateStudent(req.user._id, req.params.studentId, req.body);
  res.send(student);
});

const deleteStudent = catchAsync(async (req, res) => {
  const student = await studentService.deleteStudent(req.user._id, req.params.studentId, req.body);
  res.send(student);
});

module.exports = {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent
};
