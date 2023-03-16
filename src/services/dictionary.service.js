const httpStatus = require('http-status');
const { dictionary } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a dictionary
 * @param {Object} dictionaryBody
 * @returns {Promise<dictionary>}
 */
const createDictionary = async (dictionaryBody) => {
  return dictionary.create(dictionaryBody);
};

/**
 * Query for dictionaries
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDictionaries = async (filter, options) => {
  const dictionaries = await dictionary.paginate(filter, options);
  return dictionaries;
};

//   /**
//    * Get dictionary by name
//    * @param {string} name
//    * @returns {Promise<dictionary>}
//    */
//   const getdictionaryByName = async (name) => {
//     return dictionary.findOne({ name });
//   };

/**
 * Get dictionary by ID
 * @param {ObjectId} ID
 * @returns {Promise<dictionary>}
 */
const getDictionaryById = async (ID) => {
  return dictionary.findById(ID);
};

/**
 * Update dictionary by ID
 * @param {ObjectId} dictionaryID
 * @param {Object} updateBody
 * @returns {Promise<dictionary>}
 */
const updateDictionaryById = async (dictionaryID, updateBody) => {
  const dictionary = await getDictionaryById(dictionaryID);
  if (!dictionary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dictionary not found');
  }
  Object.assign(dictionary, updateBody);
  await dictionary.save();
  return dictionary;
};

/**
 * Delete dictionary by ID
 * @param {ObjectId} dictionaryID
 * @returns {Promise<dictionary>}
 */
const deleteDictionaryById = async (dictionaryID) => {
  const dictionary = await getdictionaryById(dictionaryID);
  if (!dictionary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dictionary not found');
  }
  await dictionary.remove();
  return dictionary;
};

module.exports = {
  createDictionary,
  queryDictionaries,
  // getdictionaryByWord,
  getDictionaryById,
  updateDictionaryById,
  deleteDictionaryById,
};
