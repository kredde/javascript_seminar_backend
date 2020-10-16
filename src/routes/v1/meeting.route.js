const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const meetingValidation = require('../../validations/meeting.validation');
const meetingController = require('../../controllers/meeting.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meetings
 *   description: Meetings of a project
 */

/**
 * @swagger
 * path:
 *  /classes/{classId}/projects/{projectId}/meetings:
 *    get:
 *      summary: Get all meetings
 *      description: Get all meetings of a project
 *      tags: [Meetings]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: classId
 *          required: true
 *          schema:
 *            type: string
 *          description: The id of the current class
 *        - in: path
 *          name: projectId
 *          required: true
 *          schema:
 *            type: string
 *          description: the id of the project
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Meeting'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router
  .route('/:classId/projects/:projectId/meetings')
  .get(auth('teacher'), validate(meetingValidation.getMeetings), meetingController.getMeetings);

/**
 * @swagger
 * path:
 *  /classes/{classId}/projects/{projectId}/meetings:
 *    post:
 *      summary: Create a new meeting
 *      description: Create a new meeting
 *      tags: [Meetings]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: classId
 *          required: true
 *          schema:
 *            type: string
 *          description: The id of the current class
 *        - in: path
 *          name: projectId
 *          required: true
 *          schema:
 *            type: string
 *          description: the id of the project
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                date:
 *                  type: string
 *                  format: date-time
 *                groupAssignment:
 *                  type: string
 *                  enum: [tandem, group3, group4, whole_class]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Meeting'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router
  .route('/:classId/projects/:projectId/meetings')
  .post(auth('teacher'), validate(meetingValidation.createMeeting), meetingController.createMeeting);

/**
 * @swagger
 * path:
 *  /classes/{classId}/projects/{projectId}/meetings:
 *    put:
 *      summary: Update a meeting
 *      description: Update a meeting
 *      tags: [Meetings]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: classId
 *          required: true
 *          schema:
 *            type: string
 *          description: The id of the current class
 *        - in: path
 *          name: projectId
 *          required: true
 *          schema:
 *            type: string
 *          description: the id of the project
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Meeting'
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Meeting'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router
  .route('/:classId/projects/:projectId/meetings')
  .post(auth('teacher'), validate(meetingValidation.createMeeting), meetingController.createMeeting);

/**
 * @swagger
 * path:
 *  /classes/{classId}/projects/{projectId}/meeting/{meetingId}:
 *    get:
 *      summary: Get a specific project
 *      description: Returns a project
 *      tags: [Meetings]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: classId
 *          required: true
 *          schema:
 *            type: string
 *          description: the class id
 *        - in: path
 *          name: projectId
 *          required: true
 *          schema:
 *            type: string
 *            description: the projectId id
 *        - in: path
 *          name: meetingId
 *          required: true
 *          schema:
 *            type: string
 *            description: the meeting id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Meeting'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router
  .route('/:classId/projects/:projectId/meetings/:meetingId')
  .get(auth('teacher'), validate(meetingValidation.getMeeting), meetingController.getMeeting);

/**
 * @swagger
 * path:
 *   /classes/{classId}/students/{studentId}/meetings/{meetingId}:
 *     delete:
 *       summary: delete a meeting
 *       description: delete a meeting
 *       tags: [Meetings]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *        - in: path
 *          name: classId
 *          required: true
 *          schema:
 *            type: string
 *          description: Class id
 *        - in: path
 *          name: studentId
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: meetingId
 *          required: true
 *          schema:
 *            type: string
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Meeting'
 *         "401":
 *            $ref: '#/components/responses/Unauthorized'
 *         "403":
 *            $ref: '#/components/responses/Forbidden'
 *         "404":
 *            $ref: '#/components/responses/NotFound'
 */
router
  .route('/:classId/projects/:projectId/meetings/:meetingId')
  .get(auth('teacher'), validate(meetingValidation.getMeeting), meetingController.getMeeting);

module.exports = router;
