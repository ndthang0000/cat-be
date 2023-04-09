const Joi = require('joi');
const { objectId } = require('./custom.validation');
const SCOPE = require('../contants/scope');
const LANGUAGE = require('../contants/language');

const createProject = {
  body: Joi.object().keys({
    projectName: Joi.string().required(),
    sourceLanguage: Joi.string()
      .required()
      .valid(...Object.values(LANGUAGE)),
    targetLanguage: Joi.string()
      .required()
      .valid(...Object.values(LANGUAGE)),
    description: Joi.string(),
    scope: Joi.string().valid(SCOPE.INDIVIDUAL, SCOPE.PUBLIC),
  }),
};

const getProjects = {
  query: Joi.object().keys({
    project_name: Joi.string(),
    user_id: Joi.string(),
    source_language: Joi.string(),
    target_language: Joi.string(),
  }),
};

const getProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      project_name: Joi.string().required(),
      user_id: Joi.string().required(),
      source_language: Joi.string().required(),
      target_language: Joi.string().required(),
    })
    .min(1),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};
