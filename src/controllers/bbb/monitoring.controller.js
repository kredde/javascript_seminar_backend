import axios from 'axios';
import xml2js from 'xml2js';

import bbb from '~/config/bbb';
import logger from '~/config/logger';

const { api } = bbb;

const getMeetings = async (req, res) => {
  const getMeetingsUrl = api.monitoring.getMeetings();

  logger.info(getMeetingsUrl);

  try {
    const xmlResponse = await axios.get(getMeetingsUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });
    res.status(200).json(result.response);
  } catch (error) {
    res.status(500).json('Could not get meetings');
  }
};

const getMeetingInfo = async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const b = req.body;

  if (b.meetingId === undefined) return res.sendStatus(400);

  const getMeetingInfoUrl = api.monitoring.getMeetingInfo(b.meetingId);

  try {
    const xmlResponse = await axios.get(getMeetingInfoUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });

    res.status(200).json(result.response);
  } catch (error) {
    res.status(500).json('Could not get meeting info');
  }
};

const isMeetingRunning = async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const b = req.body;

  if (b.meetingId === undefined) return res.sendStatus(400);

  const isMeetingRunningUrl = api.monitoring.isMeetingRunning(b.meetingId);

  try {
    const xmlResponse = await axios.get(isMeetingRunningUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });
    res.status(200).json(result.response);
  } catch (error) {
    res.status(500).json('Could not check if meeting is running');
  }
};

const get = async (req, res) => {
  await res.sendStatus(204);
};

export { getMeetings, getMeetingInfo, isMeetingRunning, get };
