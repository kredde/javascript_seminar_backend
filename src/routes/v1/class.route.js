const express = require('express');
const validate = require('../../middlewares/validate');
const classValidation = require('../../validations/class.validation');
const classController = require('../../controllers/class.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/createClass', validate(classValidation.createClass), classController.createClass)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Class
 *   description: Classes
 */

/**
 * @swagger
 * path:
 *  /class/createClass:
 *    post:
 *      summary: CreateClass
 *      tags: [Class]
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
 *                name: Hallo World!
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
 *          description: Invalid email or password
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *              example:
 *                code: 401
 *                message: Invalid email or password
 */
