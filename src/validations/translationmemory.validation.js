const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTranslationMemory = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    word: Joi.string().required(),
    translate: Joi.string().required(),
  }),
};

const getTranslationMemories = {
  query: Joi.object().keys({
    user_id: Joi.string(),
    word: Joi.string(),
    translate: Joi.string(),
  }),
};

const getTranslationMemory = {
  params: Joi.object().keys({
    TranslationMemoryId: Joi.string().custom(objectId),
  }),
};

const updateTranslationMemory = {
  params: Joi.object().keys({
    TranslationMemoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        user_id: Joi.string(),
        word: Joi.string(),
        translate: Joi.string(),
    })
    .min(1),
};

const deleteTranslationMemory = {
  params: Joi.object().keys({
    TranslationMemoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTranslationMemory,
  getTranslationMemories,
  getTranslationMemory,
  updateTranslationMemory,
  deleteTranslationMemory,
};