const express = require('express');
const validate = require('../../middlewares/validate');
const classValidation = require('../../validations/class.validation');
const classController = require('../../controllers/class.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', auth('teacher'), validate(classValidation.createClass), classController.createClass);
router.route('/').get(auth('teacher'), classController.getAllClasses);
router.route('/:classId').get(auth('teacher'), validate(classValidation.getClass), classController.getClass);
router.route('/:classId').put(auth('teacher'), validate(classValidation.updateClass), classController.updateClass);
router.route('/:classId').delete(auth('teacher'), validate(classValidation.deleteClass), classController.deleteClass);
router
  .route('/:classId/students')
  .get(auth('teacher'), validate(classValidation.getStudents), classController.getStudents);
router
  .route('/:classId/students/:studentId')
  .put(auth('teacher'), validate(classValidation.addStudent), classController.addStudent);
router
  .route('/:classId/students/:studentId')
  .delete(auth('teacher'), validate(classValidation.removeStudent), classController.removeStudent);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: CRUD for classes, only accessible by teachers
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
 *               $ref: '#/components/schemas/Class'
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

/**
 * @swagger
 * path:
 *  /classes/{classId}:
 *    put:
 *      summary: update classes
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
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Class'
 *      responses:
 *        "204":
 *          description: No content
 *        "401":
 *          description: Update class failed
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *              example:
 *                code: 401
 *                message: Update class failed
 */

/**
 * @swagger
 * path:
 *  /classes/{classId}:
 *    delete:
 *      summary: delete the class
 *      description: delete the class
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

/**
 * @swagger
 * path:
 *  /classes:
 *    get:
 *      summary: Get all classes
 *      description: get a list of classes(only the clsses of this specific teacher)
 *      tags: [Classes]
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
 *                   $ref: '#/components/schemas/Class'
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
 *   /classes/{classId}/students:
 *     get:
 *       summary: getStudents
 *       description: get all students in one class
 *       tags: [Classes]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *        - in: path
 *          name: classId
 *          required: true
 *          schema:
 *            type: string
 *          description: Class id
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Users'
 *         "401":
 *            $ref: '#/components/responses/Unauthorized'
 *         "403":
 *            $ref: '#/components/responses/Forbidden'
 *         "404":
 *            $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * path:
 *   /classes/{classId}/students/{studentId}:
 *     put:
 *       summary: addStudent
 *       description: add a student in one class
 *       tags: [Classes]
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
 *          description: Student id
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Users'
 *         "401":
 *            $ref: '#/components/responses/Unauthorized'
 *         "403":
 *            $ref: '#/components/responses/Forbidden'
 *         "404":
 *            $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * path:
 *   /classes/{classId}/students/{studentId}:
 *     delete:
 *       summary: removeStudent
 *       description: remove a student in one class
 *       tags: [Classes]
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
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Users'
 *         "401":
 *            $ref: '#/components/responses/Unauthorized'
 *         "403":
 *            $ref: '#/components/responses/Forbidden'
 *         "404":
 *            $ref: '#/components/responses/NotFound'
 */
