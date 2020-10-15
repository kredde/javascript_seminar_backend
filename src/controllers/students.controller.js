const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { createStudentNotification } = require('../utils/notifications');
const { userService, tokenService, notificationService } = require('../services');

const createStudent = catchAsync(async (req, res) => {
    const student = await userService.createUser({ ...req.body, role : 'student' })
    const token = await tokenService.generateAuthTokens(student);
    const receiverNotification = createStudentNotification(token);
    await notificationService.sendNotification(messageBody.to, receiverNotification);
    res.send(student);
});

const getStudent = catchAsync(async (req, res) => {
    const student = await userService.getUserById(req.params.studentId);
    if (!student) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
    }
    res.send(student);
});

const updateStudent = catchAsync(async (req, res) => {
    const _student = await userService.addStudentInformation(req.params.studentId, req.body);
    res.send(_student);
});

module.exports = {
    createStudent,
    getStudent,
    updateStudent
};