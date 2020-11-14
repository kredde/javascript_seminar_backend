const express = require('express');
const validate = require('../../middlewares/validate');
const { studentValidation } = require('../../validations');
const studentController = require('../../controllers/student.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * path:
 *  /students:
 *    post:
 *      summary: Register a student account
 *      tags: [Students]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - firstName
 *                - lastName
 *                - email
 *                - password
 *              properties:
 *                firstName:
 *                  type: string
 *                lastName:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *              example:
 *                firstName: Max
 *                lastName: Mark
 *                email: fake@example.com
 *                password: password1
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *                  tokens:
 *                    $ref: '#/components/schemas/AuthTokens'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 */

router.route('/').post(auth('teacher'), validate(studentValidation.createStudent), studentController.createStudent);

/**
 * @swagger
 * path:
 *  /students/{studentId}:
 *    get:
 *      summary: Get student information
 *      description: get the student profile
 *      tags: [Students]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: studentId
 *          required: true
 *          schema:
 *            type: string
 *          description: student id
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

router.route('/:studentId').get(auth(), validate(studentValidation.getStudent), studentController.getStudent);

/**
 * @swagger
 * path:
 *  /students/{studentId}:
 *    patch:
 *      summary: update student information
 *      description: update the student profile
 *      tags: [Students]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: studentId
 *          required: true
 *          schema:
 *            type: string
 *          description: Student id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                age:
 *                  type: string
 *                hobbies:
 *                  type: string
 *                notes:
 *                  type: string
 *                proficiency_level:
 *                  type: string
 *              example:
 *                age: 12
 *                hobbies: football
 *                notes: very shy
 *                proficiency_level: C1
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
router.route('/:studentId').patch(auth(), validate(studentValidation.updateStudent), studentController.updateStudent);

/**
 * @swagger
 * path:
 *  /students/{studentId}:
 *    delete:
 *      summary: delete a student
 *      description: delete a student
 *      tags: [Students]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: studentId
 *          required: true
 *          schema:
 *            type: string
 *          description: student id
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

router.route('/:studentId').delete(auth(), validate(studentValidation.deleteStudent), studentController.deleteStudent);

module.exports = router;
