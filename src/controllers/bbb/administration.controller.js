import axios from 'axios';
import { v4 as uuid4 } from 'uuid';
import xml2js from 'xml2js';

import bbb from '~/config/bbb';

const { api } = bbb;

const create = async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const b = req.body;
  // console.log(b);

  if (b.meetingName === undefined) return res.sendStatus(400);

  const kwParams = {};
  kwParams.attendeePW = b.attendeePW;
  kwParams.moderatorPW = b.moderatorPW;
  kwParams.welcome = b.welcome;
  kwParams.dialNumber = b.dialNumber;
  kwParams.voiceBridge = b.voiceBridge;
  kwParams.maxParticipants = b.maxParticipants;
  kwParams.logoutURL = b.logoutURL;
  kwParams.record = b.record;
  kwParams.duration = b.duration;
  kwParams.isBreakout = b.isBreakout;
  kwParams.parentMeetingID = b.parentMeetingID;
  kwParams.sequence = b.sequence;
  kwParams.freeJoin = b.freeJoin;
  kwParams.meta = b.meta;
  kwParams.moderatorOnlyMessage = b.moderatorOnlyMessage;
  kwParams.autoStartRecording = b.autoStartRecording;
  kwParams.allowStartStopRecording = b.allowStartStopRecording;
  kwParams.webcamsOnlyForModerator = b.webcamsOnlyForModerator;
  kwParams.logo = b.logo;
  kwParams.bannerText = b.bannerText;
  kwParams.bannerColor = b.bannerColor;
  kwParams.copyright = b.copyright;
  kwParams.muteOnStart = b.muteOnStart;
  kwParams.allowModsToUnmuteUsers = b.allowModsToUnmuteUsers;
  kwParams.lockSettingsDisableCam = b.lockSettingsDisableCam;
  kwParams.lockSettingsDisableMic = b.lockSettingsDisableMic;
  kwParams.lockSettingsDisablePrivateChat = b.lockSettingsDisablePrivateChat;
  kwParams.lockSettingsDisablePublicChat = b.lockSettingsDisablePublicChat;
  kwParams.lockSettingsDisableNote = b.lockSettingsDisableNote;
  kwParams.lockSettingsLockedLayout = b.lockSettingsLockedLayout;
  kwParams.lockSettingsLockOnJoin = b.lockSettingsLockOnJoin;
  kwParams.lockSettingsLockOnJoinConfigurable = b.lockSettingsLockOnJoinConfigurable;
  kwParams.guestPolicy = b.guestPolicy;

  Object.keys(kwParams).forEach((key) => kwParams[key] === undefined && delete kwParams[key]);

  const uuid = uuid4();

  // api module itself is responsible for constructing URLs
  const meetingCreateUrl = api.administration.create(b.meetingName, uuid, kwParams);

  // console.log(meetingCreateUrl);

  const meetingInfo = {};

  try {
    const xmlResponse = await axios.get(meetingCreateUrl);

    const result = await xml2js.parseStringPromise(xmlResponse.data, {
      mergeAttrs: true
    });

    const moderatorUrl = api.administration.join(b.moderator, uuid, b.moderatorPW);
    const attendeeUrl = api.administration.join(b.attendee, uuid, b.attendeePW);
    const meetingEndUrl = api.administration.end(uuid, b.moderatorPW);

    meetingInfo.attendeeUrl = attendeeUrl;
    meetingInfo.moderatorUrl = moderatorUrl;
    meetingInfo.meetingEndUrl = meetingEndUrl;
    meetingInfo.result = result;

    await res.status(200).json(meetingInfo);
  } catch (error) {
    await res.status(500).json('Could not create meeting');
  }
};

const join = async (req, res) => {
  // if request has no body -> response 400
  if (!req.body) return res.sendStatus(400);

  const b = req.body;

  // if request body does not have required values -> response 400
  if (b.fullName === undefined || b.meetingId === undefined || b.password === undefined) return res.sendStatus(400);

  // gather optional params
  const kwParams = {};

  kwParams.createTime = b.createTime;
  kwParams.userID = b.userID;
  kwParams.webVoiceConf = b.webVoiceConf;
  kwParams.configToken = b.configToken;
  kwParams.defaultLayout = b.defaultLayout;
  kwParams.avatarURL = b.avatarURL;
  kwParams.redirect = b.redirect;
  kwParams.clientURL = b.clientURL;
  kwParams.joinViaHtml5 = b.joinViaHtml5;
  kwParams.guest = b.guest;

  // api module itself is responsible for constructing URLs
  // password is either moderatorPW/attendeePW
  const meetingJoinUrl = api.administration.join(b.fullName, b.meetingId, b.password);
  const meetingInfo = {};

  meetingInfo.request = {};
  meetingInfo.request.createTime = b.createTime;
  meetingInfo.request.userID = b.userID;
  meetingInfo.request.webVoiceConf = b.webVoiceConf;
  meetingInfo.request.configToken = b.configToken;
  meetingInfo.request.defaultLayout = b.defaultLayout;
  meetingInfo.request.avatarURL = b.avatarURL;
  meetingInfo.request.redirect = b.redirect;
  meetingInfo.request.clientURL = b.clientURL;
  meetingInfo.request.joinViaHtml5 = b.joinViaHtml5;
  meetingInfo.request.guest = b.guest;

  meetingInfo.response = {};
  meetingInfo.response.joinURL = meetingJoinUrl;

  await res.status(200).json(meetingInfo);
};

const endPost = async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const b = req.body;
  // console.log(b);

  if (b.meetingId === undefined || b.moderatorPW === undefined) return res.sendStatus(400);

  // api module itself is responsible for constructing URLs
  // password has to be moderatorPW
  const meetingEndUrl = api.administration.end(b.meetingId, b.moderatorPW);

  const meetingInfo = {};
  meetingInfo.request = {};

  meetingInfo.request.meetingId = b.meetingId;
  meetingInfo.request.moderatorPW = b.moderatorPW;

  meetingInfo.response = {};
  meetingInfo.response.meetingEndUrl = meetingEndUrl;

  await res.status(200).json(meetingInfo);
};

const endDel = async (req, res) => {
  if (Object.keys(req.query).length === 0) return res.sendStatus(400);

  const p = req.query;

  if (p.meetingId === undefined || p.moderatorPW === undefined) return res.sendStatus(400);

  const meetingEndUrl = api.administration.end(p.meetingId, p.moderatorPW);

  try {
    const xmlResponse = await axios.get(meetingEndUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, {
      mergeAttrs: true
    });
    res.status(200).json(result.response);
  } catch (error) {
    res.status(500).json('Could not end meeting');
  }
};

const get = async (req, res) => {
  await res.sendStatus(402);
};

export { create, join, endPost, endDel, get };
