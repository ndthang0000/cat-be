const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createWord = {
  body: Joi.object().keys({
    dictionary_id: Joi.string().required(),
    source: Joi.string().required(),
    target: Joi.string().required(),
  }),
};

const getWords = {
  query: Joi.object().keys({
    dictionary_id: Joi.string().required(),
    source: Joi.string(),
    target: Joi.string()
  }),
};

const getWord = {
  params: Joi.object().keys({
    wordId: Joi.string().custom(objectId),
  }),
};

const updateWord = {
  params: Joi.object().keys({
    wordId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        dictionary_id: Joi.string().required(),
        source: Joi.string(),
        target: Joi.string(),
    })
    .min(1),
};

const deleteWord = {
  params: Joi.object().keys({
    wordId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createWord,
  getWords,
  getWord,
  updateWord,
  deleteWord,
};
