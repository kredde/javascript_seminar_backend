const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/').get(auth(), validate(userValidation.getUser), userController.getUser);

module.exports = router;

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
