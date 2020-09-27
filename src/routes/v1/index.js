const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const userRoute = require('./user.route');
const classRoute = require('./class.route');
const schoolRoute = require('./school.route');
const projectRoute = require('./project.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/docs', docsRoute);
router.use('/me', userRoute);
router.use('/classes', classRoute);
router.use('/schools', schoolRoute);
router.use('/classes', projectRoute);

module.exports = router;
