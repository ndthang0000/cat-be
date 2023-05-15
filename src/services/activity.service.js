const httpStatus = require('http-status');
const { Activity } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a activity
 * @param {Object} activityBody
 * @returns {Promise<activity>}
 */
const createActivity = async (activityBody) => {
  return Activity.create(activityBody);
};

/**
 * Query for activities
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryActivities = async (filter, options) => {
  const activities = await Activity.paginate(filter, options);
  return activities;
};

/**
 * Get activity by ID
 * @param {ObjectId} ID
 * @returns {Promise<activity>}
 */
const getActivityById = async (ID) => {
  return Activity.findById(ID);
};

/**
 * Update activity by ID
 * @param {ObjectId} activityID
 * @param {Object} updateBody
 * @returns {Promise<activity>}
 */
const updateActivityById = async (activityID, updateBody) => {
  const activity = await getActivityById(activityID);
  if (!activity) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Activity not found');
  }
  Object.assign(activity, updateBody);
  await activity.save();
  return activity;
};

/**
 * Delete activity by ID
 * @param {ObjectId} activityID
 * @returns {Promise<activity>}
 */
const deleteActivityById = async (activityID) => {
  const activity = await getActivityById(activityID);
  if (!activity) {
    throw new ApiError(httpStatus.NOT_FOUND, 'activity not found');
  }
  await activity.remove();
  return activity;
};

module.exports = {
  createActivity,
  queryActivities,
  getActivityById,
  updateActivityById,
  deleteActivityById,
};
