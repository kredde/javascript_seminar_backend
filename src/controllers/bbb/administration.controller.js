import axios from 'axios';
import { v4 as uuid4 } from 'uuid';
import xml2js from 'xml2js';

import bbb from '~/config/bbb';
import { generatePassword } from '~/services/bbb.service';

const create = async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const b = req.body;

  if (b.meetingName === undefined) return res.sendStatus(400);

  const kwParams = {
    attendeePW: generatePassword(32),
    moderatorPW: generatePassword(32),
    welcome: b.welcome,
    dialNumber: b.dialNumber,
    voiceBridge: b.voiceBridge,
    maxParticipants: b.maxParticipants,
    logoutURL: b.logoutURL,
    record: b.record || true,
    duration: b.duration,
    isBreakout: b.isBreakout,
    parentMeetingID: b.parentMeetingID,
    sequence: b.sequence,
    freeJoin: b.freeJoin,
    meta: b.meta,
    moderatorOnlyMessage: b.moderatorOnlyMessage,
    autoStartRecording: b.autoStartRecording,
    allowStartStopRecording: b.allowStartStopRecording,
    webcamsOnlyForModerator: b.webcamsOnlyForModerator,
    logo: b.logo,
    bannerText: b.bannerText,
    bannerColor: b.bannerColor,
    copyright: b.copyright,
    muteOnStart: b.muteOnStart,
    allowModsToUnmuteUsers: b.allowModsToUnmuteUsers,
    lockSettingsDisableCam: b.lockSettingsDisableCam,
    lockSettingsDisableMic: b.lockSettingsDisableMic,
    lockSettingsDisablePrivateChat: b.lockSettingsDisablePrivateChat,
    lockSettingsDisablePublicChat: b.lockSettingsDisablePublicChat,
    lockSettingsDisableNote: b.lockSettingsDisableNote,
    lockSettingsLockedLayout: b.lockSettingsLockedLayout,
    lockSettingsLockOnJoin: b.lockSettingsLockOnJoin,
    lockSettingsLockOnJoinConfigurable: b.lockSettingsLockOnJoinConfigurable,
    guestPolicy: b.guestPolicy
  };

  Object.keys(kwParams).forEach((key) => kwParams[key] === undefined && delete kwParams[key]);

  const uuid = uuid4();

  // api module itself is responsible for constructing URLs
  const meetingCreateUrl = bbb.api.administration.create(b.meetingName, uuid, kwParams);

  try {
    const xmlResponse = await axios.get(meetingCreateUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });

    const response = {
      meetingID: result.response.meetingID,
      attendeePW: result.response.attendeePW,
      moderatorPW: result.response.moderatorPW
    };

    await res.status(200).json(response);
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
  const kwParams = {
    createTime: b.createTime,
    userID: b.userID,
    webVoiceConf: b.webVoiceConf,
    configToken: b.configToken,
    defaultLayout: b.defaultLayout,
    avatarURL: b.avatarURL,
    redirect: b.redirect,
    clientURL: b.clientURL,
    joinViaHtml5: b.joinViaHtml5,
    guest: b.guest
  };

  // api module itself is responsible for constructing URLs
  // password is either moderatorPW/attendeePW
  const meetingJoinUrl = bbb.api.administration.join(b.fullName, b.meetingId, b.password, kwParams);

  const response = {
    meetingJoinUrl
  };

  await res.status(200).json(response);
};

const endPost = async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const b = req.body;
  // console.log(b);

  if (b.meetingId === undefined || b.moderatorPW === undefined) return res.sendStatus(400);

  // api module itself is responsible for constructing URLs
  // password has to be moderatorPW
  const meetingEndUrl = bbb.api.administration.end(b.meetingId, b.moderatorPW);

  const response = {
    meetingEndUrl
  };

  await res.status(200).json(response);
};

const endDel = async (req, res) => {
  if (Object.keys(req.query).length === 0) return res.sendStatus(400);

  const p = req.query;

  if (p.meetingId === undefined || p.moderatorPW === undefined) return res.sendStatus(400);

  const meetingEndUrl = bbb.api.administration.end(p.meetingId, p.moderatorPW);

  try {
    const xmlResponse = await axios.get(meetingEndUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });

    res.status(200).json(result.response);
  } catch (error) {
    res.status(500).json('Could not end meeting');
  }
};

const get = async (req, res) => {
  await res.sendStatus(204);
};

export { create, join, endPost, endDel, get };
