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
const updateUserById = async (classId, updateBody) => {
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

module.exports = {
  createClass,
  getClassById,
  updateUserById,
  deleteClassById
};
