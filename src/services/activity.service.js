const httpStatus = require('http-status');
const { Activity } = require('../models');
const ApiError = require('../utils/ApiError');

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
 * @returns {Promise<Activity>}
 */
const getActivityById = async (ID) => {
  return Activity.findById(ID);
};


module.exports = {
  queryActivities,
  getActivityById,
};
