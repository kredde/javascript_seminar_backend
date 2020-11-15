const httpStatus = require('http-status');
const bbbService = require('./bbb.service');
const { Meeting, Room, Project } = require('../models');

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

const getMeetingById = async (id, userId) => {
  const meeting = await Meeting.findOne({ _id: id })
    .populate('groups.participants')
    .populate('groups.room')
    .populate('taskList.quizzes')
    .populate('taskList.drawits')
    .populate('taskList.aliases');

  const project = await Project.findById(meeting.project).populate('classes');
  const myClass = project.classes.find((_class) => String(_class.teacher) === String(userId));
  if (myClass) {
    const groups = meeting.groups.map((group) => {
      const newGroup = { ...group.toJSON() };
      newGroup.participants = newGroup.participants.map((student) => ({
        ...student,
        isMyClass: myClass.students.indexOf(String(student.id)) >= 0
      }));
      return newGroup;
    });
    return { ...meeting.toJSON(), groups };
  }
  return meeting;
};
const getMeetings = async (projectId, userId) => {
  const meetings = await Meeting.find({ project: projectId })
    .populate('groups.participants')
    .populate('groups.room')
    .populate('taskList.quizzes')
    .populate('taskList.drawits')
    .populate('taskList.aliases');

  const project = await Project.findById(projectId).populate('classes');
  const myClass = project.classes.find((_class) => String(_class.teacher) === String(userId));

  if (myClass) {
    return meetings.map((meeting) => {
      const groups = meeting.groups.map((group) => {
        const newGroup = { ...group.toJSON() };
        newGroup.participants = newGroup.participants.map((student) => ({
          ...student,
          isMyClass: myClass.students.indexOf(String(student.id)) >= 0
        }));
        return newGroup;
      });
      return { ...meeting.toJSON(), groups };
    });
  }
  return meetings;
};

const updateMeetingById = async (meetingId, updateBody) => {
  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meeting not found');
  }

  const body = { ...updateBody };

  body.groups = body.groups.map((group) => {
    // eslint-disable-next-line
    group.participants = group.participants.map((participant) =>
      typeof participant === 'object' ? participant._id || participant.id : participant
    );

    // eslint-disable-next-line
    group.room = typeof group.room === 'object' ? group.room._id || group.room.id : room;
    return group;
  });

  ['drawits', 'aliases', 'quizzes'].forEach((game) => {
    body.taskList[game] = body.taskList[game].map((task) => (typeof task === 'object' ? task._id || task.id : task));
  });

  Object.assign(meeting, body);

  await meeting.save();

  return getMeetingById(meeting._id);
};

const deleteMeetingById = async (meetingId) => {
  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meeting not found');
  }

  const endMeetingsPromises = meeting.groups.map((group) => bbbService.end(group.room));
  await Promise.all(endMeetingsPromises);

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
