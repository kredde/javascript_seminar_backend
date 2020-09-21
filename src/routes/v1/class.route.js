const express = require('express');
const validate = require('../../middlewares/validate');
const classValidation = require('../../validations/class.validation');
const classController = require('../../controllers/class.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', auth(), validate(classValidation.createClass), classController.createClass);
router.route('/:classId').get(auth(), validate(classValidation.getClass), classController.getClass);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Classes
 */

/**
 * @swagger
 * path:
 *  /classes:
 *    post:
 *      summary: Create a new class
 *      tags: [Classes]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - language
 *                - subject
 *              properties:
 *                name:
 *                  type: string
 *                  format: name
 *                language:
 *                  type: string
 *                  format: language
 *                subject:
 *                  type: string
 *                  format: subject
 *              example:
 *                name: Hello World!
 *                language: English
 *                subject: sub1
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  class:
 *                    $ref: '#/components/schemas/Class'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * path:
 *  /classes/{classId}:
 *    get:
 *      summary: Get a class
 *      description: get the class
 *      tags: [Classes]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: classId
 *          required: true
 *          schema:
 *            type: string
 *          description: Class id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Class'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
