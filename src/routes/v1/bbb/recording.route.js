import Router from 'express-promise-router';
import bodyParser from 'body-parser';

import recordingController from '~/controllers/bbb/recording.controller';

const recordingRouter = Router();

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

const route = '/recording';

// returns list of recordings
recordingRouter.post(`${route}/get_recordings`, urlencodedParser, recordingController.getRecordings);
recordingRouter.post(`${route}/publish_recordings`, urlencodedParser, recordingController.publishRecordings);
recordingRouter.delete(`${route}/delete_recordings`, recordingController.deleteRecordings);
recordingRouter.patch(`${route}/update_recordings`, urlencodedParser, recordingController.updateRecordings);
recordingRouter.get(route, recordingController.get);

export default recordingRouter;

/**
 * @swagger
 * tags:
 *  - name: recording
 *    description: recording calls
 */

/**
 * @swagger
 *
 * /recording/get_recordings:
 *  post:
 *    summary: Retrieves the recordings that are available for playback for a given meetingID (or set of meeting IDs).
 *    tags:
 *    - recording
 *    requestBody:
 *      required: false
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              meetingId:
 *                type: string
 *                description: A meeting ID for get the recordings. It can be a set of meetingIDs separate by commas. If the meeting ID is not specified, it will get ALL the recordings. If a recordID is specified, the meetingID is ignored.
 *              recordId:
 *                type: string
 *                description: A record ID for get the recordings. It can be a set of recordIDs separate by commas. If the record ID is not specified, it will use meeting ID as the main criteria. If neither the meeting ID is specified, it will get ALL the recordings. The recordID can also be used as a wildcard by including only the first characters in the string.
 *              state:
 *                type: string
 *                description: attribute that shows a state that Indicates if the recording is [processing|processed|published|unpublished|deleted]. The parameter state can be used to filter results. It can be a set of states separate by commas. If it is not specified only the states [published|unpublished] are considered. If it is specified as “any”, recordings in all states are included.
 *              meta:
 *                type: string
 *                description: You can pass one or more metadata values to filter the recordings returned. The format of these parameters is the same as the metadata passed to the create call.
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Internal Server Error
 */

/**
 * @swagger
 *
 * /recording/publish_recordings:
 *  post:
 *    summary: Publish and unpublish recordings for given recordID or set of record IDs
 *    tags:
 *    - recording
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            required:
 *              - recordId
 *              - publish
 *            properties:
 *              recordId:
 *                type: string
 *                description: A record ID for specify the recordings to apply the publish action. It can be a set of record IDs separated by commas.
 *              publish:
 *                type: string
 *                description: Value for publishing or unpublishing the recordings.
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Internal Server Error
 */

/**
 * @swagger
 *
 * /recording/delete_recordings:
 *  delete:
 *    summary: Delete one or more recordings for a given recordID (or set of record IDs).
 *    tags:
 *    - recording
 *    parameters:
 *      - name: recordId
 *        description: A record ID for specify the recordings to delete. It can be a set of record IDs separated by commas.
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Internal Server Error
 */

/**
 * @swagger
 *
 * /recording/update_recordings:
 *  patch:
 *    summary: Update metadata for a given recordID (or set of record IDs).
 *    tags:
 *    - recording
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            required:
 *              - recordId
 *            properties:
 *              recordId:
 *                type: string
 *                description: A record ID for specify the recordings to apply the publish action. It can be a set of record IDs separated by commas.
 *              meta:
 *                type: string
 *                description: You can pass one or more metadata values to be updated. The format of these parameters is the same as the metadata passed to the create call. For more information see the docs for the create call. When meta_parameter=NOT EMPTY and meta_parameter exists its value is updated, if it doesn’t exist, the parameter is added. When meta_parameter=, and meta_parameter exists the key is removed, when it doesn’t exist the action is ignored.
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Internal Server Error
 */

/**
 * @swagger
 *
 * /recording:
 *  get:
 *    tags:
 *    - recording
 *    summary: Forbidden
 *    responses:
 *      403:
 *        description: Forbidden
 */
