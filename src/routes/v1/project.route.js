const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const upload = require('../../middlewares/multer');
const { projectController } = require('../../controllers');

const router = express.Router();

router.get('/test', projectController.test);
router.post('/upload-file', upload.single('file'), projectController.testUploadFile);

module.exports = router;
