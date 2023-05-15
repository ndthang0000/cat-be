const Joi = require('joi');
const { objectId } = require('./custom.validation');
const SCOPE = require('../constants/scope');
const LANGUAGE = require('../constants/language');
const { SORT_PROJECT } = require('../constants/sort');
const { PROJECT_ROLE } = require('../constants/status');

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
    page: Joi.number(),
    limit: Joi.number(),
    type: Joi.string().valid('All', 'Individual').default('All'),
    search: Joi.string().allow(''),
    sortBy: Joi.string().valid(...Object.values(SORT_PROJECT), ''),
  }),
};

const uploadFile = {
  body: Joi.object().keys({
    file: Joi.number(),
    limit: Joi.number(),
    type: Joi.string().valid('ALL', 'INDIVIDUAL'),
    search: Joi.string().allow(''),
  }),
};

const getProject = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

const openFileOfProject = {
  body: Joi.object().keys({
    slug: Joi.string().required(),
    fileId: Joi.string().required().custom(objectId),
  }),
  query: {
    limit: Joi.number(),
    page: Joi.number(),
    status: Joi.string().allow('', null),
  },
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

const addMemberToProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    email: Joi.string().required(),
    role: Joi.string()
      .valid(...Object.values(PROJECT_ROLE))
      .default(PROJECT_ROLE.GUEST),
  }),
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  openFileOfProject,
  addMemberToProject,
};
