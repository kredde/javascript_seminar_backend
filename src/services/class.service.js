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
const getClassById = async (id) => {
  return Class.findOne({ _id: id });
};

/**
 * Update class by id
 * @param {ObjectId} classId
 * @param {Object} updateBody
 * @returns {Promise<Class>}
 */
const updateClassById = async (classId, updateBody) => {
  const _class = await getClassById(classId);
  if (!_class) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Class not found');
  }
  Object.assign(_class, updateBody);
  await _class.save();
  return _class;
};

const deleteClassById = async (classId) => {
  const _class = await getClassById(classId);
  if (!_class) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await _class.remove();
  return _class;
};

const getAllClasses = async (userId) => {
  return Class.find({ teacher: userId });
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
