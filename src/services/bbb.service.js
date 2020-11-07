import cryptoRandomString from 'crypto-random-string';
import { v4 as uuid4 } from 'uuid';
import axios from 'axios';
import xml2js from 'xml2js';

import bbb from '~/config/bbb';

const generatePassword = (l) => {
  return cryptoRandomString({ length: l, type: 'url-safe' });
};

const create = async (obj) => {
  // if object does not have required values, reject
  if (obj.meetingName === undefined) return Promise.reject();

  const kwParams = {
    attendeePW: generatePassword(32),
    moderatorPW: generatePassword(32),
    welcome: obj.welcome,
    dialNumber: obj.dialNumber,
    voiceBridge: obj.voiceBridge,
    maxParticipants: obj.maxParticipants,
    logoutURL: obj.logoutURL,
    record: obj.record || true,
    duration: obj.duration,
    isBreakout: obj.isBreakout,
    parentMeetingID: obj.parentMeetingID,
    sequence: obj.sequence,
    freeJoin: obj.freeJoin,
    meta: obj.meta,
    moderatorOnlyMessage: obj.moderatorOnlyMessage,
    autoStartRecording: obj.autoStartRecording,
    allowStartStopRecording: obj.allowStartStopRecording,
    webcamsOnlyForModerator: obj.webcamsOnlyForModerator,
    logo: obj.logo,
    bannerText: obj.bannerText,
    bannerColor: obj.bannerColor,
    copyright: obj.copyright,
    muteOnStart: obj.muteOnStart,
    allowModsToUnmuteUsers: obj.allowModsToUnmuteUsers,
    lockSettingsDisableCam: obj.lockSettingsDisableCam,
    lockSettingsDisableMic: obj.lockSettingsDisableMic,
    lockSettingsDisablePrivateChat: obj.lockSettingsDisablePrivateChat,
    lockSettingsDisablePublicChat: obj.lockSettingsDisablePublicChat,
    lockSettingsDisableNote: obj.lockSettingsDisableNote,
    lockSettingsLockedLayout: obj.lockSettingsLockedLayout,
    lockSettingsLockOnJoin: obj.lockSettingsLockOnJoin,
    lockSettingsLockOnJoinConfigurable: obj.lockSettingsLockOnJoinConfigurable,
    guestPolicy: obj.guestPolicy
  };
  Object.keys(kwParams).forEach((key) => kwParams[key] === undefined && delete kwParams[key]);

  const uuid = uuid4();

  // api module itself is responsible for constructing URLs
  const meetingCreateUrl = bbb.api.administration.create(obj.meetingName, uuid, kwParams);

  try {
    const xmlResponse = await axios.get(meetingCreateUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });

    return {
      meetingId: result.response.meetingID,
      attendeePW: result.response.attendeePW,
      moderatorPW: result.response.moderatorPW
    };
  } catch (error) {
    return Promise.reject();
  }
};

const join = (obj) => {
  // if object does not have required values, return
  if (obj.fullName === undefined || obj.meetingId === undefined || obj.password === undefined) return;

  const kwParams = {
    createTime: obj.createTime,
    userID: obj.userID,
    webVoiceConf: obj.webVoiceConf,
    configToken: obj.configToken,
    defaultLayout: obj.defaultLayout,
    avatarURL: obj.avatarURL,
    redirect: obj.redirect,
    clientURL: obj.clientURL,
    joinViaHtml5: obj.joinViaHtml5,
    guest: obj.guest
  };

  // api module itself is responsible for constructing URLs
  // password is either moderatorPW/attendeePW
  const meetingJoinUrl = bbb.api.administration.join(obj.fullName, obj.meetingId, obj.password, kwParams);

  return {
    meetingJoinUrl
  };
};

const end = (obj) => {
  // if object does not have required values, return
  if (obj.meetingId === undefined || obj.moderatorPW === undefined) return;

  // api module itself is responsible for constructing URLs
  // password has to be moderatorPW
  const meetingEndUrl = bbb.api.administration.end(obj.meetingId, obj.moderatorPW);

  return {
    meetingEndUrl
  };
};

export { generatePassword, create, join, end };
