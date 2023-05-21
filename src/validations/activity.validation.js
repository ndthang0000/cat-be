const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createActivity = {
  body: Joi.object().keys({
    comment: Joi.string().required(),
    userId: Joi.string(),
    action: Joi.string().required(),
    projectId: Joi.string(),
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

module.exports = {
  createActivity,
  getActivities,
  getActivity,
};
