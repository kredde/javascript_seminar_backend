const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const userRoute = require('./user.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/docs', docsRoute);
router.use('/me', userRoute);

module.exports = router;
