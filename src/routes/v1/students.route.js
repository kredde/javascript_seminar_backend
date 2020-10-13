const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const studentsController = require('../../controllers/students.controller');
const auth = require('../../middlewares/auth');


const router = express.Router();
router.route('/students').post(auth('teacher'), validate(userValidation.createUser), studentsController.createStudent);
router.route('/students/:studentsId').get(auth('teacher'), validate(userValidation.getUser), studentsController.getStudent);
router.route('/students/:studentsId').get(auth('student'), validate(userValidation.getUser), studentsController.getStudent);
router.route('/students/:studentsId').patch(auth('teacher'), validate(userValidation.updateUser), studentsController.updateStudent);
router.route('/students/:studentsId').patch(auth('student'), validate(userValidation.updateUser), studentsController.updateStudent);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: CRUD for students, only accessible by teachers
 */

 /**
 * @swagger
 * path:
 *  /students:
 *    post:
 *      summary: Create a new student
 *      tags: [Students]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  class:
 *                    $ref: '#/components/schemas/User'
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
 *  /students/{studentsId}:
 *    get:
 *      summary: Get a student
 *      description: teacher calls up a student user
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

 
 /**
 * @swagger
 * path:
 *  /students/{studentsId}:
 *    get:
 *      summary: Get a student
 *      description: The student calls up his user account
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

 /**
 * @swagger
 * path:
 *  /students/{studentsId}:
 *    patch:
 *      summary: update a student
 *      description: teacher updates a student
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

  /**
 * @swagger
 * path:
 *  /students/{studentsId}:
 *    patch:
 *      summary: update a student
 *      description: student updates his informations
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