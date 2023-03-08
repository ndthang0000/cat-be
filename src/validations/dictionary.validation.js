const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDictionary = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    word: Joi.string().required(),
    wordtype: Joi.string(),
    mean: Joi.string().required(),
  }),
};

const getDictionaries = {
  query: Joi.object().keys({
    user_id: Joi.string().required(),
    word: Joi.string(),
    wordtype: Joi.string(),
    mean: Joi.string()
  }),
};

const getDictionary = {
  params: Joi.object().keys({
    DictionaryId: Joi.string().custom(objectId),
  }),
};

const updateDictionary = {
  params: Joi.object().keys({
    DictionaryId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        user_id: Joi.string().required(),
        word: Joi.string(),
        wordtype: Joi.string(),
        mean: Joi.string(),
    })
    .min(1),
};

const deleteDictionary = {
  params: Joi.object().keys({
    DictionaryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDictionary,
  getDictionaries,
  getDictionary,
  updateDictionary,
  deleteDictionary,
};
