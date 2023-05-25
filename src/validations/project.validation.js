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
  body: Joi.object().keys({
    _id: Joi.string().required().custom(objectId),
    priority: Joi.number(),
    projectName: Joi.string(),
    description: Joi.string(),
    scope: Joi.string().valid(...Object.values(SCOPE)),
  }),
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

const removeMemberFromProject = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
    id: Joi.string().required(),
  }),
};

const exportFile = {
  body: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
    fileId: Joi.string().custom(objectId).required(),
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
  removeMemberFromProject,
  exportFile,
};
