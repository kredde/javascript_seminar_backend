const httpStatus = require('http-status');
const projectService = require('./project.service');
const { User, Class } = require('../models');
const ApiError = require('../utils/ApiError');
const meetingService = require('./meeting.service');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const addStudentInformation = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!updateBody.age && !updateBody.hobby) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cant update student. No valid properties.');
  }
  Object.assign(user, { age: updateBody.age, hobby: updateBody.hobby });
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const getStudents = async (userId) => {
  const classes = await Class.find({ teacher: userId }).populate('students');
  if (!classes) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classes not found');
  }
  const students = new Set();
  classes.forEach((_class) => _class.students.forEach((student) => students.add(student)));
  return Array.from(students);
};

const getMeetings = async (user) => {
  const { role } = user;

  let classes;
  if (role === 'teacher') {
    classes = await Class.find({ teacher: user._id });
  } else {
    classes = await Class.find({ students: { $elemMatch: { $in: [user._id] } } });
  }
  const projects = await Promise.all(classes.map((classModel) => projectService.getProjects(classModel.id)));
  const meetings = await Promise.all(projects.flat().map((project) => meetingService.getMeetings(project._id)));

  return meetings.flat();
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getStudents,
  addStudentInformation,
  getMeetings
};
