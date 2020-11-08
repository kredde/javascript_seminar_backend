const httpStatus = require('http-status');
const bbbService = require('./bbb.service');
const { Meeting, Room } = require('../models');

const ApiError = require('../utils/ApiError');
const { createGroups } = require('../utils/create-groups');

const createMeeting = async (meetingBody) => {
  const meeting = await Meeting.create(meetingBody);
  const groups = await createGroups(meeting);

  const roomPromises = groups.map((group, index) =>
    bbbService.create({
      meetingName: `group_${index}-${meeting.id}`, // This is the name shown in the meeting room, so maybe change
      maxParticipants: group.length
    })
  );

  const roomObjects = await Promise.all(roomPromises);

  const roomCreatePromises = roomObjects.map((room) => new Room(room).save());
  const rooms = await Promise.all(roomCreatePromises);

  meeting.groups = groups.map((group, i) => ({ participants: group, room: rooms[i] }));
  await meeting.save();
  return meeting;
};

const getMeetingById = async (id) => {
  return Meeting.findOne({ _id: id }).populate('groups.participants').populate('groups.room');
};

const getMeetings = async (project) => {
  return Meeting.find({ project }).populate('groups.participants').populate('groups.room');
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
