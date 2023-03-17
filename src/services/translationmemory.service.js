const httpStatus = require('http-status');
const { TranslationMemory } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a TranslationMemory
 * @param {Object} TranslationMemoryBody
 * @returns {Promise<TranslationMemory>}
 */
const createTranslationMemory = async (TranslationMemoryBody) => {
  return TranslationMemory.create(TranslationMemoryBody);
};

/**
 * Query for TranslationMemories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTranslationMemories = async (filter, options) => {
  const TranslationMemories = await TranslationMemory.paginate(filter, options);
  return TranslationMemories;
};

/**
 * Get TranslationMemory by code
 * @param {string} codeTrans
 * @returns {Promise<TranslationMemory>}
 */
const getTranslationMemoryByCode = async (codeTrans) => {
  return TranslationMemory.find({ translationmemory_code: codeTrans });
};

/**
 * Get TranslationMemory by ID
 * @param {ObjectId} ID
 * @returns {Promise<TranslationMemory>}
 */
const getTranslationMemoryById = async (ID) => {
  return TranslationMemory.findById(ID);
};

/**
 * Update TranslationMemory by ID
 * @param {ObjectId} TranslationMemoryID
 * @param {Object} updateBody
 * @returns {Promise<TranslationMemory>}
 */
const updateTranslationMemoryById = async (TranslationMemoryID, updateBody) => {
  const TranslationMemory = await getTranslationMemoryById(TranslationMemoryID);
  if (!TranslationMemory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TranslationMemory not found');
  }
  Object.assign(TranslationMemory, updateBody);
  await TranslationMemory.save();
  return TranslationMemory;
};

/**
 * Delete TranslationMemory by ID
 * @param {ObjectId} TranslationMemoryID
 * @returns {Promise<TranslationMemory>}
 */
const deleteTranslationMemoryById = async (TranslationMemoryID) => {
  const TranslationMemory = await getTranslationMemoryById(TranslationMemoryID);
  if (!TranslationMemory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TranslationMemory not found');
  }
  await TranslationMemory.remove();
  return TranslationMemory;
};

module.exports = {
  createTranslationMemory,
  queryTranslationMemories,
  getTranslationMemoryByCode,
  getTranslationMemoryById,
  updateTranslationMemoryById,
  deleteTranslationMemoryById,
};
