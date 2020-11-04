import bodyParser from 'body-parser';
import Router from 'express-promise-router';
import monitoringController from '~/controllers/bbb/monitoring.controller';

const monitoringRouter = Router();

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

const route = '/monitoring';

monitoringRouter.get(`${route}/get_meetings`, monitoringController.getMeetings);
monitoringRouter.post(`${route}/get_meeting_info`, urlencodedParser, monitoringController.getMeetingInfo);
monitoringRouter.post(`${route}/is_meeting_running`, urlencodedParser, monitoringController.isMeetingRunning);
monitoringRouter.get(route, monitoringController.get);

export default monitoringRouter;

/**
 * @swagger
 * tags:
 *  - name: monitoring
 *    description: monitoring calls
 */

/**
 * @swagger
 *
 * /monitoring/get_meetings:
 *  get:
 *    summary: Gets meetings
 *    tags:
 *    - monitoring
 *    responses:
 *      200:
 *        description: OK
 *      500:
 *        description: Internal Server Error
 */

/**
 * @swagger
 *
 * /monitoring/get_meeting_info:
 *  post:
 *    summary: Gets meeting Info
 *    tags:
 *    - monitoring
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            required:
 *              - meetingId
 *            properties:
 *              meetingId:
 *                type: string
 *                description: The meeting ID that identifies the meeting you are attempting to check on.
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
 * /monitoring/is_meeting_running:
 *  post:
 *    summary: Checks if meeting is running
 *    tags:
 *    - monitoring
 *    requestBody:
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            required:
 *              - meetingId
 *            properties:
 *              meetingId:
 *                type: string
 *                description: The meeting ID that identifies the meeting you are attempting to check on.
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
 * /monitoring:
 *  get:
 *    tags:
 *    - monitoring
 *    summary: Forbidden
 *    responses:
 *      403:
 *        description: Forbidden
 */
