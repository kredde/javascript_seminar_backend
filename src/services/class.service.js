const httpStatus = require('http-status');
const { Class, Project } = require('../models');
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
  throw new ApiError(httpStatus.BAD_REQUEST, 'Can not create more than 10 classes');
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

function pre(level) {
  switch (level) {
    case 'A1':
      return 'A1';
    case 'A2':
      return 'A1';
    case 'B1':
      return 'A2';
    case 'B2':
      return 'B1';
    case 'C1':
      return 'B2';
    case 'C2':
      return 'C1';
    default:
  }
}

function suc(level) {
  switch (level) {
    case 'A1':
      return 'A2';
    case 'A2':
      return 'B1';
    case 'B1':
      return 'B2';
    case 'B2':
      return 'C1';
    case 'C1':
      return 'C2';
    case 'C2':
      return 'C2';
    default:
  }
}

/**
 * find a set of similar classes using the current class
 *
 *
 * @param {Class} currentClass
 * @param {ObjectId} teacher
 * @returns {Promise<[Class]>}
 */

const findSimilarClasses = async (currentClass, teacher, query) => {
  const projects = await Project.find({ classes: { $elemMatch: { $in: [currentClass._id] } } });
  const classes = projects
    .filter((x) => x.state === 'ongoing')
    .map((x) => {
      if (currentClass._id.equals(x.classes[0])) {
        return x.classes[1];
      }
      return x.classes[0];
    });
  const classQuery = {
    teacher: { $ne: teacher },
    subject: currentClass.subject,
    language: currentClass.language,
    level: currentClass.level,
    _id: { $nin: classes }
  };

  if (currentClass.languageLevel) {
    classQuery.languageLevel = {
      $in: [pre(currentClass.languageLevel), currentClass.languageLevel, suc(currentClass.languageLevel)]
    };
  }

  if (query.projectDuration) {
    classQuery.projectDuration = query.projectDuration;
  }

  if (query.country) {
    classQuery.country = query.country;
  }

  if (query.meetingFrequency) {
    classQuery.meetingFrequency = query.meetingFrequency;
  }

  const similarClasses = await Class.find(classQuery).populate('teacher');

  const fiteredClasses = similarClasses.filter(
    (cl) =>
      cl.students.length >= Math.min(0, (currentClass.students.length || 0) - 4) &&
      cl.students.length <= (currentClass.students.length || 0) + 4
  );

  // TODO sort classes
  return fiteredClasses;
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
