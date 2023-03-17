const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDictionary = {
  body: Joi.object().keys({
    dictionary_name: Joi.string(),
    dictionary_code: Joi.string().required(),
    source_language: Joi.string().required(),
    target_language: Joi.string().required(),
  }),
};

const getDictionaries = {
  query: Joi.object().keys({
    dictionary_name: Joi.string(),
    dictionary_code: Joi.string(),
    source_language: Joi.string(),
    target_language: Joi.string(),
  }),
};

const getDictionary = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const updateDictionary = {
  params: Joi.object().keys({
    projectId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      dictionary_name: Joi.string(),
      dictionary_code: Joi.string().required(),
      source_language: Joi.string().required(),
      target_language: Joi.string().required(),
    })
    .min(1),
};

const deleteDictionary = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDictionary,
  getDictionaries,
  getDictionary,
  updateDictionary,
  deleteDictionary,
};
