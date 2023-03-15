const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    project_name: Joi.string().required(),
    user_id: Joi.string().required(),
    source_language: Joi.string().required(),
    target_language: Joi.string().required(),
    date_modified: Joi.date(),
  }),
};

const getProjects = {
  query: Joi.object().keys({
    project_name: Joi.string().required(),
    user_id: Joi.string().required(),
    source_language: Joi.string().required(),
    target_language: Joi.string().required(),
    date_modified: Joi.date(),
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
        date_modified: Joi.date(),
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
