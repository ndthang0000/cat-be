const httpStatus = require('http-status');
const { word } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a word
 * @param {Object} wordBody
 * @returns {Promise<word>}
 */
const createWord = async (wordBody) => {
  return word.create(wordBody);
};

/**
 * Query for words
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWords = async (filter, options) => {
  const words = await word.paginate(filter, options);
  return words;
};

/**
 * Get word trans by dictionary id
 * @param {string} dictionaryID
 * @returns {Promise<word>}
 */
const getWordsByDictionaryID = async (dictionaryID) => {
  return word.find({ dictionary_id: dictionaryID });
};

/**
 * Get word by ID
 * @param {ObjectId} ID
 * @returns {Promise<word>}
 */
const getWordById = async (ID) => {
  return word.findById(ID);
};

/**
 * Update word by ID
 * @param {ObjectId} wordID
 * @param {Object} updateBody
 * @returns {Promise<word>}
 */
const updateWordById = async (wordID, updateBody) => {
  const word = await getWordById(wordID);
  if (!word) {
    throw new ApiError(httpStatus.NOT_FOUND, 'word not found');
  }
  Object.assign(word, updateBody);
  await word.save();
  return word;
};

/**
 * Delete word by ID
 * @param {ObjectId} wordID
 * @returns {Promise<word>}
 */
const deleteWordById = async (wordID) => {
  const word = await getWordById(wordID);
  if (!word) {
    throw new ApiError(httpStatus.NOT_FOUND, 'word not found');
  }
  await word.remove();
  return word;
};

module.exports = {
  createWord,
  queryWords,
  getWordsByDictionaryID,
  getWordById,
  updateWordById,
  deleteWordById,
};
