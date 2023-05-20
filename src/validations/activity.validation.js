const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getActivities = {
  query: Joi.object().keys({
    comment: Joi.string(),
    userId: Joi.string(),
    action: Joi.string(),
    projectId: Joi.string(),
    fileId: Joi.string(),
  }),
};

const getActivity = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getActivities,
  getActivity,
};
