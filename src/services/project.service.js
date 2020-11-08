const httpStatus = require('http-status');
const { Project, Class, User } = require('../models');
const classService = require('./class.service');
const notificationService = require('./notification.service');
const messageService = require('./message.service');
const createProjectNotification = require('../utils/notifications').createProject;
const { receiveMessage } = require('../utils/notifications');
const ApiError = require('../utils/ApiError');

const createProject = async (classId, body, teacher) => {
  const teacherClass = await classService.getClassById(classId, teacher);
  const otherClass = await Class.findById(body.class);

  if (!teacherClass || !otherClass) {
    throw new ApiError(httpStatus.NOT_FOUND, 'One of the classes does not exist');
  }

  const project = await Project.create({
    classes: [teacherClass._id, otherClass._id],
    state: 'pending',
    startedBy: teacher
  });
  if (body.initialMessage) {
    const message = await messageService.createMessage({
      message: body.initialMessage,
      from: teacher,
      to: otherClass.teacher
    });
    project.messages.push(message._id);
    await project.save();
  }
  const teacherModel = await User.findById(teacher);
  const notification = createProjectNotification({
    teacherClass,
    otherClass,
    teacher: teacherModel,
    message: body.initialMessage
  });
  await notificationService.sendNotification(otherClass.teacher, notification);

  return project;
};

const getProjectById = async (id, teacher) => {
  const project = await Project.findOne({ _id: id }).populate('classes').populate('startedBy');
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
  const projects = await Project.find({ classes: { $elemMatch: { $in: [classId] } } })
    .populate({
      path: 'classes',
      populate: { path: 'teacher' }
    })
    .populate('startedBy');
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

const deleteProjectById = async (id, teacher) => {
  const project = await getProjectById(id,teacher);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  await project.remove();
  return project;
};

const getAllMessages = async (id, teacher) => {
  const project = await Project.findOne({ _id: id }).populate('classes messages');

  const teacherIds = project && project.classes.map((c) => String(c.teacher));
  if (project && teacherIds.indexOf(teacher) < 0) {
    throw new ApiError(httpStatus.FORBIDDEN, 'No class belongs to the teacher');
  }
  return project.messages;
};

const addMessage = async (id, messageBody, teacher) => {
  const project = await getProjectById(id, teacher);
  const teacherIds = project && project.classes.map((c) => String(c.teacher));
  if (teacherIds.indexOf(teacher) < 0 || teacherIds.indexOf(messageBody.to) < 0) {
    throw new ApiError(httpStatus.FORBIDDEN, 'message invalid');
  }
  const message = await messageService.createMessage(messageBody);
  await Project.updateOne({ _id: id }, { $push: { messages: message._id } });
  const receiverNotification = receiveMessage(await User.findById(messageBody.from), messageBody.message);
  await notificationService.sendNotification(messageBody.to, receiverNotification);

  return message;
};

module.exports = {
  createProject,
  getProjectById,
  getProjects,
  updateProjectById,
  deleteProjectById,
  getAllMessages,
  addMessage
};
