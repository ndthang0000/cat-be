const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createWordTrans = {
  body: Joi.object().keys({
    project_id: Joi.string().required(),
    source: Joi.string().required(),
    target: Joi.string().required(),
  }),
};

const getWordsTrans = {
  query: Joi.object().keys({
    project_id: Joi.string().required(),
    source: Joi.string(),
    target: Joi.string()
  }),
};

const getWordTrans = {
  params: Joi.object().keys({
    wordId: Joi.string().custom(objectId),
  }),
};

const updateWordTrans = {
  params: Joi.object().keys({
    wordId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        project_id: Joi.string().required(),
        source: Joi.string(),
        target: Joi.string(),
    })
    .min(1),
};

const deleteWordTrans = {
  params: Joi.object().keys({
    wordId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createWordTrans,
  getWordsTrans,
  getWordTrans,
  updateWordTrans,
  deleteWordTrans,
};
