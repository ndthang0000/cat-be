const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { activityService } = require('../services');

const createActivity = catchAsync(async (req, res) => {
  const activity = await activityService.createActivity(req.body);
  res.status(httpStatus.CREATED).send(activity);
});

const getActivities = catchAsync(async (req, res) => {
  const filters = { projectId: req.query.projectId };
  const options = pick(req.query, ['limit', 'page']);
  const result = await activityService.queryActivities(filters, options);
  res.send(result);
});

const getActivity = catchAsync(async (req, res) => {
  const activity = await activityService.getActivityById(req.params.activityId);
  if (!activity) {
    throw new ApiError(httpStatus.NOT_FOUND, 'activity not found');
  }
  res.send(activity);
});

const updateActivity = catchAsync(async (req, res) => {
  const activity = await activityService.updateActivityById(req.params.activityId, req.body);
  res.send(activity);
});

const deleteActivity = catchAsync(async (req, res) => {
  await activityService.deleteActivityById(req.params.activityId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
};
