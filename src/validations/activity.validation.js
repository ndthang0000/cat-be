const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createActivity = {
  body: Joi.object().keys({
    comment: Joi.string(),
    userId: Joi.string().required(),
    action: Joi.string().required(),
    projectId: Joi.string().required(),
  }),
};

const getActivities = {
  query: Joi.object().keys({
    comment: Joi.string(),
    userId: Joi.string(),
    action: Joi.string(),
    projectId: Joi.string(),
  }),
};

const getActivity = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateActivity = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      comment: Joi.string(),
      userId: Joi.string().required(),
      action: Joi.string().required(),
      projectId: Joi.string().required(),
    })
    .min(1),
};

const deleteActivity = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
};
