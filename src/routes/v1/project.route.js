const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { projectController } = require('../../controllers');

const router = express.Router();

router.get('/test', projectController.test);

module.exports = router;
