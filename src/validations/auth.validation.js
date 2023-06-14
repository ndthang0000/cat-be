const Joi = require('joi');
const { password } = require('./custom.validation');
const LANGUAGE = require('../constants/language');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const addDictionary = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    sourceLanguage: Joi.string()
      .required()
      .valid(...Object.values(LANGUAGE)),
    targetLanguage: Joi.string()
      .required()
      .valid(...Object.values(LANGUAGE)),
  }),
};

const addTranslationMemory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    sourceLanguage: Joi.string()
      .required()
      .valid(...Object.values(LANGUAGE)),
    targetLanguage: Joi.string()
      .required()
      .valid(...Object.values(LANGUAGE)),
  }),
};

const getTmDict = {
  query: Joi.object().keys({
    target: Joi.string().required(),
    source: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  addDictionary,
  addTranslationMemory,
  getTmDict,
};
