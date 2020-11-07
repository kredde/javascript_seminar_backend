import axios from 'axios';
import xml2js from 'xml2js';
import bbb from '~/config/bbb';

const { api } = bbb;

const getRecordings = async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const b = req.body;

  // optional parameters
  const kwParams = {};
  kwParams.meetingID = b.meetingId;
  kwParams.recordID = b.recordId;
  kwParams.state = b.state;
  kwParams.meta = b.meta;

  Object.keys(kwParams).forEach((key) => kwParams[key] === undefined && delete kwParams[key]);

  const getRecordingsUrl = api.recording.getRecordings(kwParams);

  try {
    const xmlResponse = await axios.get(getRecordingsUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });

    res.status(200).json(result.response);
  } catch (error) {
    res.status(500).json('Could not get recordings');
  }
};

const publishRecordings = async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const b = req.body;

  if (b.recordId === undefined || b.publish === undefined) return res.sendStatus(400);

  const publishRecordingsUrl = api.recording.publishRecordings(b.recordId, b.publish);

  try {
    const xmlResponse = await axios.get(publishRecordingsUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });
    res.status(200).json(result.response);
  } catch (error) {
    res.status(500).json('Could not publish recordings');
  }
};

const deleteRecordings = async (req, res) => {
  if (Object.keys(req.query).length === 0) return res.sendStatus(400);

  const p = req.query;

  if (p.recordId === undefined) return res.sendStatus(400);

  const deleteRecordingsUrl = api.recording.deleteRecordings(p.recordId);

  try {
    const xmlResponse = await axios.get(deleteRecordingsUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });
    res.status(200).json(result.response);
  } catch (error) {
    res.status(500).json('Could not delete recordings');
  }
};

const updateRecordings = async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const b = req.body;

  if (b.recordId === undefined) return res.sendStatus(400);

  const kwParams = {};

  if (b.meta !== undefined) kwParams.meta = b.meta;

  const updateRecordingsUrl = api.recording.updateRecordings(b.recordId, kwParams);

  try {
    const xmlResponse = await axios.get(updateRecordingsUrl);
    const result = await xml2js.parseStringPromise(xmlResponse.data, { mergeAttrs: true, explicitArray: false });

    res.status(200).json(result.response);
  } catch (error) {
    res.status(500).json('Could not update recordings');
  }
};

const get = async (req, res) => {
  await res.sendStatus(204);
};

export { getRecordings, publishRecordings, deleteRecordings, updateRecordings, get };
