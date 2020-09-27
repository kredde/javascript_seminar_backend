const express = require('express');
const validate = require('../../middlewares/validate');
const schoolValidation = require('../../validations/school.validation');
const schoolController = require('../../controllers/school.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
router.route('/').post(auth('teacher'), validate(schoolValidation.createSchool), schoolController.createSchool);
router.route('/').get(auth('teacher'), validate(schoolValidation.getSchools), schoolController.getSchools);
router.route('/:schoolId').get(auth('teacher'), validate(schoolValidation.getSchool), schoolController.getSchool);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: CRUD for schools, only accessible by teachers
 */

/**
 * @swagger
 * path:
 *   /schools:
 *     post:
 *       summary: Create a new school
 *       tags: [Schools]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/School'
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   school:
 *                     $ref: '#/components/schemas/School'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * path:
 *   /schools:
 *     get:
 *       summary: get schools
 *       description: get schools by keyword
 *       tags: [Schools]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *        - in: query
 *          name: name
 *          required: false
 *          schema:
 *            type: string
 *          description: keyword
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/School'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * path:
 *   /schools/{schoolId}:
 *     get:
 *       summary: get school
 *       description: get school by Id
 *       tags: [Schools]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *        - in: path
 *          name: schoolId
 *          required: true
 *          schema:
 *            type: string
 *          description: School id
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/School'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
