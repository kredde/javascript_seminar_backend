const express = require('express');
const validate = require('../../middlewares/validate');
const projectValidation = require('../../validations/project.validation');
const projectController = require('../../controllers/project.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project between two classes
 */

/**
 * @swagger
 * path:
 *  /classes/{classId}/projects:
 *    post:
 *      summary: Create a new project
 *      description: Create a new project using an array of two classes and sends an invitation to the other classes teacher
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: classId
 *          required: true
 *          schema:
 *            type: string
 *          description: The id of the current class
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               class:
 *                 type: string
 *                 description: the class to match with
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router
  .route('/:classId/projects')
  .post(auth('teacher'), validate(projectValidation.createProject), projectController.createProject);

/**
 * @swagger
 * path:
 *  /classes/{classId}/projects:
 *    get:
 *      summary: Get a list of projects
 *      description: All the projects of the class
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: classId
 *          required: true
 *          schema:
 *            type: string
 *            description: The id of the class
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                   $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router.route('/:classId/projects').get(auth('teacher'), projectController.getProjects);

/**
 * @swagger
 * path:
 *  /classes/{classId}/projects/{projectId}:
 *    get:
 *      summary: Get a specific project
 *      description: Returns a project
 *      tags: [Projects]
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
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router
  .route('/:classId/projects/:projectId')
  .get(auth('teacher'), validate(projectValidation.getProject), projectController.getProject);

/**
 * @swagger
 * path:
 *  /classes/{classId}/projects/{projectId}/accept-invitation:
 *    post:
 *      summary: Accept an invitation to a project
 *      description: Accepts an invitation to a project
 *      tags: [Projects]
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
 *          description: the projectId id
 *      responses:
 *        "204":
 *          description: No Content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
router
  .route('/:classId/projects/:projectId/accept-invitation')
  .post(auth('teacher'), validate(projectValidation.getProject), projectController.acceptInvitation);

module.exports = router;
