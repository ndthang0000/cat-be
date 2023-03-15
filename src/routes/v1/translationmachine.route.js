const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const translationMachineController = require('../../controllers/translationmachine.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('getTranslation'), translationMachineController.getWordMean);

module.exports = router;
