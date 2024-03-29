const httpStatus = require('http-status');
const { Activity } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a project
 * @param {Object} activityBody
 * @returns {Promise<Project>}
 */
const createActivity = async (activityBody) => {
  return await new Activity(activityBody).save();
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
const queryActivities = async (filters, options) => {
  const filtersAgg = [
    {
      $match: filters,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $unwind: '$owner',
    },
  ];

  const activities = await Activity.paginateAgg(filtersAgg, options);
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
  createActivity,
  queryActivities,
  getActivityById,
};
