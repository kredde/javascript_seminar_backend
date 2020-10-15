const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { createStudentNotification } = require('../utils/notifications');
const { userService, tokenService, notificationService, studentService } = require('../services');

const createStudent = catchAsync(async (req, res) => {
  const student = await userService.createUser({ ...req.body, role: 'student' });
  const tokens = await tokenService.generateAuthTokens(student);
  const receiverNotification = createStudentNotification(tokens);
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

module.exports = {
  createStudent,
  getStudent,
  updateStudent
};
