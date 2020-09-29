const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService } = require('../services');

const createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.params.classId, req.body.class, req.user._id);

  res.send(project);
});

const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.projectId, req.user._id);

  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  res.send(project);
});

const getProjects = catchAsync(async (req, res) => {
  const projects = await projectService.getProjects(req.params.classId);

  res.send(projects);
});

const acceptInvitation = catchAsync(async (req, res) => {
  await projectService.updateProjectById(req.params.projectId, req.user._id, {
    state: 'ongoing'
  });

  res.status(204).send();
});

const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectById(req.params.projectId, req.user._id, req.body);

  res.send(project);
});

const getAllMessages = catchAsync(async (req, res) => {
  const messages = await projectService.getAllMessages(req.params.projectId, req.user._id);
  res.send(messages);
});

const addMessage = catchAsync(async (req, res) => {
  const messages = await projectService.addMessage(req.params.projectId, req.body, req.user._id);
  res.send(messages);
});

module.exports = {
  createProject,
  getProject,
  getProjects,
  acceptInvitation,
  updateProject,
  getAllMessages,
  addMessage
};
