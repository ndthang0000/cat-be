const httpStatus = require('http-status');
const { translationMemory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a translationMemory
 * @param {Object} translationMemoryBody
 * @returns {Promise<translationMemory>}
 */
const createTranslationMemory = async (translationMemoryBody) => {
  return translationMemory.create(translationMemoryBody);
};

/**
 * Query for translationMemories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTranslationMemories = async (filter, options) => {
  const translationMemories = await translationMemory.paginate(filter, options);
  return translationMemories;
};

/**
 * Get translationMemory by code
 * @param {string} codeTrans
 * @returns {Promise<translationMemory>}
 */
const getTranslationMemoryByCode = async (codeTrans) => {
  return translationMemory.find({ translationMemory_code: codeTrans });
};

/**
 * Get translationMemory by ID
 * @param {ObjectId} ID
 * @returns {Promise<translationMemory>}
 */
const getTranslationMemoryById = async (ID) => {
  return translationMemory.findById(ID);
};

/**
 * Update translationMemory by ID
 * @param {ObjectId} translationMemoryID
 * @param {Object} updateBody
 * @returns {Promise<translationMemory>}
 */
const updateTranslationMemoryById = async (translationMemoryID, updateBody) => {
  const translationMemory = await getTranslationMemoryById(translationMemoryID);
  if (!translationMemory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'translationMemory not found');
  }
  Object.assign(translationMemory, updateBody);
  await translationMemory.save();
  return translationMemory;
};

/**
 * Delete translationMemory by ID
 * @param {ObjectId} translationMemoryID
 * @returns {Promise<translationMemory>}
 */
const deleteTranslationMemoryById = async (translationMemoryID) => {
  const translationMemory = await getTranslationMemoryById(translationMemoryID);
  if (!translationMemory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'translationMemory not found');
  }
  await translationMemory.remove();
  return translationMemory;
};

module.exports = {
  createTranslationMemory,
  queryTranslationMemories,
  getTranslationMemoryByCode,
  getTranslationMemoryById,
  updateTranslationMemoryById,
  deleteTranslationMemoryById,
};
