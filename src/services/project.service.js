const httpStatus = require('http-status');
const { Project, Class } = require('../models');
const { classService, userService, notificationService, messageService } = require('.');
const createProjectNotification = require('../utils/notifications').createProject;
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const createProject = async (classId, body, teacher) => {
  const teacherClass = await classService.getClassById(classId, teacher);
  const otherClass = await Class.findById(body);

  if (!teacherClass || !otherClass) {
    throw new ApiError(httpStatus.NOT_FOUND, 'One of the classes does not exist');
  }

  const project = await Project.create({ classes: [teacherClass._id, otherClass._id], state: 'pending' });
  const teacherModel = await userService.getUserById(teacher);
  const notification = createProjectNotification({ teacherClass, otherClass, teacher: teacherModel });
  await notificationService.sendNotification(otherClass.teacher, notification);

  return project;
};

const getProjectById = async (id, teacher) => {
  const project = await Project.findOne({ _id: id }).populate('classes');
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  const teacherIds = project && project.classes.map((c) => String(c.teacher));
  if (project && teacherIds.indexOf(teacher) < 0) {
    throw new ApiError(httpStatus.FORBIDDEN, 'No class belongs to the teacher');
  }
  return project;
};

const getProjects = async (classId) => {
  const projects = await Project.find({ classes: { $elemMatch: { $in: [classId] } } });

  return projects;
};

const updateProjectById = async (id, teacher, body) => {
  const project = await Project.findOne({ _id: id }).populate('classes');

  const teacherIds = project && project.classes.map((c) => String(c.teacher));
  if (project && teacherIds.indexOf(teacher) < 0) {
    throw new ApiError(httpStatus.FORBIDDEN, 'No class belongs to the teacher');
  }

  Object.assign(project, { state: body.state });
  await project.save();
  return project;
};

const getAllMessages = async (id, teacher) => {
  const project = await getProjectById(id, teacher);
  await project.populate('messages');
  return project.messages;
};

const addMessage = async (id, messageBody, teacher) => {
  const project = await getProjectById(id, teacher);
  const teacherIds = project && project.classes.map((c) => String(c.teacher));
  logger.info(teacher);
  logger.info(messageBody.from);
  logger.info(messageBody.to);
  logger.info(teacherIds);
  if (teacherIds.indexOf(teacher) < 0 || teacherIds.indexOf(messageBody.to) < 0) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Message authority error');
  }
  await messageService.getMessage();
  const message = await messageService.createMessage(messageBody);
  await Project.update({ _id: id }, { $push: { messages: message._id } });
};

module.exports = {
  createProject,
  getProjectById,
  getProjects,
  updateProjectById,
  getAllMessages,
  addMessage
};
