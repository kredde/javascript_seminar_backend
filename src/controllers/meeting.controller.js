const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { meetingService } = require('../services');

const createMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.createMeeting({ ...req.body, project: req.params.projectId });
  res.send(meeting);
});

const getMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.getMeetingById(req.params.meetingId, req.user._id);
  if (!meeting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meeting not found');
  }
  res.send(meeting);
});

const getMeetings = catchAsync(async (req, res) => {
  const meetings = await meetingService.getMeetings(req.params.projectId, req.user._id);
  res.send(meetings);
});

const updateMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.updateMeetingById(req.params.meetingId, req.body);
  res.send(meeting);
});

const deleteMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.deleteMeetingById(req.params.meetingId);
  res.send(meeting);
});

module.exports = {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting
};
