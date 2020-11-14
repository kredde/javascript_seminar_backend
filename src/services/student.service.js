const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');

const hasAuthority = async (userId, studentId) => {
  const user = await userService.getUserById(userId);
  if (user.role === 'teacher') {
    const students = await userService.getStudents(userId);
    const studentIds = students.map((student) => student._id.toString());
    return userId.equals(studentId) || studentIds.includes(studentId);
  }
  return userId.equals(studentId);
};
const isEmailAndNameChanged = (student, updateBody) => {
  return (
    (updateBody.email && updateBody.email !== student.email) ||
    (updateBody.firstName && updateBody.firstName !== student.firstName) ||
    (updateBody.lastName && updateBody.lastName !== student.lastName)
  );
};
const getStudent = async (userId, studentId) => {
  if (!(await hasAuthority(userId, studentId))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'unauthorized');
  }
  const student = await userService.getUserById(studentId);
  return student;
};

/**
 * updateStudentById, can not change email and name
 * @param {ObjectId} userId
 * @param {ObjectId} studentId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateStudent = async (userId, studentId, updateBody) => {
  const student = await getStudent(userId, studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  if (isEmailAndNameChanged(student, updateBody)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email and Name can not change');
  }
  Object.assign(student, updateBody);
  await student.save();
  return student;
};

const deleteStudent = async (userId, studentId) => {
  const student = await getStudent(userId, studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await student.remove();
  return student;
}

module.exports = {
  getStudent,
  updateStudent,
  deleteStudent
};
