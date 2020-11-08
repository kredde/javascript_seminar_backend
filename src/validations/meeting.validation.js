const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createMeeting = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    date: Joi.date().required(),
    groupAssignment: Joi.any()
      .allow(...['tandem', 'group3', 'group4', 'whole_class'])
      .required(),
    taskList: Joi.array().items(Joi.string()),
    duration: Joi.number()
  })
};

const getMeeting = {
  params: Joi.object().keys({
    meetingId: Joi.string().custom(objectId)
  })
};

const getMeetings = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId)
  })
};

const updateMeeting = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId),
    meetingId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    id: Joi.string(),
    date: Joi.date(),
    project: Joi.string,
    groupAssignment: Joi.any().allow(...['tandem', 'group3', 'group4', 'whole_class']),
    groups: Joi.array().items(Joi.object()),
    taskList: Joi.array().items(Joi.string()),
    duration: Joi.number(),
    joinUrl: Joi.string()
  })
};

const deleteMeeting = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    classId: Joi.string().custom(objectId),
    meetingId: Joi.string().custom(objectId)
  })
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting
};
