const express = require('express');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations/user.validation');
const studentsController = require('../../controllers/students.controller');
const auth = require('../../middlewares/auth');


const router = express.Router();
router.route('/students').post(auth('teacher'), validate(userValidation.createStudent), studentsController.createStudent);
router.route('/students/:studentsId').get(auth('teacher'), validate(userValidation.getUser), studentsController.getStudent);
router.route('/students/:studentsId').get(auth('student'), validate(userValidation.getUser), studentsController.getStudent);
router.route('/students/:studentsId').patch(auth('teacher'), validate(userValidation.updateUser), studentsController.updateStudent);
router.route('/students/:studentsId').patch(auth('student'), validate(userValidation.updateUser), studentsController.updateStudent);


/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: CRUD for students, only accessible by teachers
 */
