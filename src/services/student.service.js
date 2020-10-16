const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { userService } = require('.');

const hasAuthority = (userId, studentId) => {
  /** still need to do functionality get all students of a teacher */
  if (!userId && !studentId) return true;
};
const isEmailAndNameChanged = (student, updateBody) => {
  return (
    (updateBody.email && updateBody.email !== student.email) ||
    (updateBody.firstName && updateBody.firstName !== student.firstName) ||
    (updateBody.lastName && updateBody.lastName !== student.lastName)
  );
};
const getStudent = async (userId, studentId) => {
  if (hasAuthority(userId, studentId)) {
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

module.exports = {
  getStudent,
  updateStudent
};
