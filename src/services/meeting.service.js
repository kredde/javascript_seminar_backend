const httpStatus = require('http-status');
const { Meeting } = require('../models');
const ApiError = require('../utils/ApiError');
const { createGroups } = require('../utils/create-groups');

const createMeeting = async (meetingBody) => {
  const meeting = await Meeting.create(meetingBody);
  meeting.groups = await createGroups(meeting);

  await meeting.save();
  return meeting;
};

const getMeetingById = async (id) => {
  return Meeting.findOne({ _id: id });
};

const getMeetings = async (project) => {
  return Meeting.find({ project });
};

const updateMeetingById = async (meetingId, updateBody) => {
  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meeting not found');
  }

  const body = { ...updateBody };
  // update groups if group-assignment changes
  if (body.groupAssignment && meeting.groupAssignment !== body.groupAssignment) {
    body.groups = await createGroups(body);
  }

  Object.assign(meeting, body);
  await meeting.save();
  return meeting;
};

const deleteMeetingById = async (meetingId) => {
  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meeting not found');
  }

  await meeting.remove();
  return meeting;
};

module.exports = {
  getMeetingById,
  getMeetings,
  updateMeetingById,
  createMeeting,
  deleteMeetingById
};
