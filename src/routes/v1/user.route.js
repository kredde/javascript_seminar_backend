const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User
 */

/**
 * @swagger
 * path:
 *  /me:
 *    get:
 *      summary: Get your user
 *      description: Logged in users can fetch only their own user information
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/User'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router.route('/').get(auth(), validate(userValidation.getUser), userController.getUser);

/**
 * @swagger
 * path:
 *  /me/notifications:
 *    get:
 *      summary: Get notifications of the user
 *      description: All the notifications of the user will be returned
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                   $ref: '#/components/schemas/Notification'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router.route('/notifications').get(auth(), userController.getNotifications);

/**
 * @swagger
 * path:
 *  /me/notifications/{id}:
 *    get:
 *      summary: Get a specific notificatioin
 *      description: Returns a notification and marks it as opened
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Notification id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Notification'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router
  .route('/notifications/:notificationId')
  .get(auth(), validate(userValidation.getNotification), userController.getNotification);

/**
 * @swagger
 * path:
 *  /me/students:
 *    get:
 *      summary: Get all your students
 *      description: Logged in users can fetch only their students
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Users'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

router.route('/students').get(auth('teacher'), userController.getStudents);

/**
 * @swagger
 * path:
 *  /me/meetings:
 *    get:
 *      summary: Get all your meetings
 *      description: Logged in users can fetch their meetings
 *      tags: [User]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Meeting'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

router.route('/meetings').get(auth('teacher'), userController.getMeetings);

module.exports = router;
