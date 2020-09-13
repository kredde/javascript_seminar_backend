const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/docs', docsRoute);

module.exports = router;
