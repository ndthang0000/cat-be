const Joi = require('joi');
const { objectId } = require('./custom.validation');
const LANGUAGE = require('../constants/language');

const createWordTrans = {
  body: Joi.object().keys({
    project_id: Joi.string().required(),
    source: Joi.string().required(),
    target: Joi.string().required(),
  }),
};

const getWordsTrans = {
  query: Joi.object().keys({
    project_id: Joi.string(),
    source: Joi.string(),
    target: Joi.string(),
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

const translateMachineSentence = {
  body: Joi.object().keys({
    sentence: Joi.string().required(),
    target: Joi.string()
      .valid(...Object.values(LANGUAGE))
      .default(LANGUAGE.VI),
  }),
};

const getWordDictionary = {
  body: Joi.object().keys({
    sentence: Joi.string().required(),
    projectId: Joi.string().required().custom(objectId),
  }),
};

const fuzzyMatching = {
  body: Joi.object().keys({
    sentence: Joi.string().required(),
    projectId: Joi.string().required().custom(objectId),
    fileId: Joi.string().required().custom(objectId),
  }),
};

const detectTermBase = {
  body: Joi.object().keys({
    sentence: Joi.string().required(),
    projectId: Joi.string().required().custom(objectId),
  }),
};

const applyMachineForAllSentence = {
  body: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
    fileId: Joi.string().required().custom(objectId),
    optionMachine: Joi.number().default(1),
  }),
};

const applyMachineForOneSentence = {
  body: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
    fileId: Joi.string().required().custom(objectId),
    sentenceId: Joi.string().required().custom(objectId),
  }),
};

const confirmSentence = {
  body: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
    fileId: Joi.string().required().custom(objectId),
    sentenceId: Joi.string().required().custom(objectId),
    data: Joi.string().required(),
  }),
};

const statisticFile = {
  body: Joi.object().keys({
    fileId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createWordTrans,
  getWordsTrans,
  getWordTrans,
  updateWordTrans,
  deleteWordTrans,
  translateMachineSentence,
  getWordDictionary,
  fuzzyMatching,
  applyMachineForAllSentence,
  applyMachineForOneSentence,
  confirmSentence,
  statisticFile,
  detectTermBase,
};
