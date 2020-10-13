const httpStatus = require('http-status');
const { Class } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a class
 * @param classBody
 * @returns {Promise<Class>}
 */

const createClass = async (classBody) => {
  const classes = await Class.find({ teacher: classBody.teacher });
  if (classes.length <= 9) {
    const _class = await Class.create(classBody);
    return _class;
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Can not create more than 10 classes');
};

/**
 * Get class by id
 *
 * @param {ObjectId} id
 * @returns {Promise<Class>}
 */
const getClassById = async (id, teacher) => {
  return Class.findOne({ _id: id, teacher });
};

/**
 * Update class by id
 *
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
  const _class = await Class.findOne({ _id: classId }).populate('students');
  return _class.students;
};

const addStudent = async (classId, userId) => {
  await Class.update({ _id: classId }, { $push: { students: userId } });
  const _class = await Class.find({ _id: classId });
  return _class;
};

const removeStudent = async (classId, userId) => {
  await Class.update({ _id: classId }, { $pull: { students: userId } });
  const _class = await Class.find({ _id: classId });
  return _class;
};

const getAllClasses = async (teacher) => {
  const _classes = await Class.find({ teacher });
  return _classes;
};

/**
 * find a set of similar classes using the current class
 *
 *
 * @param {Class} currentClass
 * @param {ObjectId} teacher
 * @returns {Promise<[Class]>}
 */
const findSimilarClasses = async (currentClass, teacher) => {
  const similarClasses = await Class.find({
    teacher: { $ne: teacher },
    subject: currentClass.subject,
    language: currentClass.language,
    level: { $gte: Math.min(1, currentClass.level - 3), $lte: Math.max(currentClass.level + 3, 10) }
  });

  // TODO sort classes
  return similarClasses;
};

module.exports = {
  createClass,
  getClassById,
  updateClassById,
  deleteClassById,
  getAllClasses,
  getStudents,
  addStudent,
  removeStudent,
  findSimilarClasses
};
