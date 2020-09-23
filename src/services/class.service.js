const httpStatus = require('http-status');
const { Class } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a class
 * @param classBody
 * @returns {Promise<Class>}
 */

const createClass = async (classBody) => {
  const _class = await Class.create(classBody);
  return _class;
};

/**
 * Get class by id
 * @param {ObjectId} id
 * @returns {Promise<Class>}
 */
const getClassById = async (id, teacher) => {
  return Class.findOne({ _id: id, teacher });
};

/**
 * Update class by id
 * @param {ObjectId} classId
 * @param {Object} updateBody
 * @returns {Promise<Class>}
 */
const updateClassById = async (classId, teacher, updateBody) => {
  const _class = await getClassById(classId, teacher);
  if (!_class) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  Object.assign(_class, updateBody);
  await _class.save();
  return _class;
};

const deleteClassById = async (classId, teacher) => {
  const _class = await getClassById(classId, teacher);
  if (!_class) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await _class.remove();
  return _class;
};

const getStudents = async (classId) => {
  return Class.find({ _id: classId }).students;
};

const addStudent = async (classId, userId) => {
  Class.update({ _id: classId }, { $push: { students: userId } });
  return Class.find({ _id: classId });
};

const removeStudent = async (classId, userId) => {
  Class.update({ _id: classId }, { $pull: { students: userId } });
  return Class.find({ _id: classId });
};

const getAllClasses = async (teacher) => {
  return Class.find({ teacher });
};

module.exports = {
  createClass,
  getClassById,
  updateClassById,
  deleteClassById,
  getAllClasses,
  getStudents,
  addStudent,
  removeStudent
};
