const httpStatus = require('http-status');
const { Dictionary } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Dictionary
 * @param {Object} DictionaryBody
 * @returns {Promise<Dictionary>}
 */
const createDictionary = async (DictionaryBody) => {
    return Dictionary.create(DictionaryBody);
  };
  
  /**
   * Query for Dictionaries
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  const queryDictionarys = async (filter, options) => {
    const Dictionaries = await Dictionary.paginate(filter, options);
    return Dictionaries;
  };

  /**
   * Get Dictionary by word
   * @param {string} word
   * @returns {Promise<Dictionary>}
   */
  const getDictionaryByWord = async (word) => {
    return Dictionary.findOne({ word });
  };

   /**
   * Get Dictionary by ID
   * @param {ObjectId} ID
   * @returns {Promise<Dictionary>}
   */
   const getDictionaryById = async (ID) => {
    return Dictionary.findById(ID);
  };
  
  /**
   * Update Dictionary by ID
   * @param {ObjectId} DictionaryID
   * @param {Object} updateBody
   * @returns {Promise<Dictionary>}
   */
  const updateDictionaryById = async (DictionaryID, updateBody) => {
    const Dictionary = await getDictionaryById(DictionaryID);
    if (!Dictionary) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Dictionary not found');
    }
    Object.assign(Dictionary, updateBody);
    await Dictionary.save();
    return Dictionary;
  };
  
  /**
   * Delete Dictionary by ID
   * @param {ObjectId} DictionaryID
   * @returns {Promise<Dictionary>}
   */
  const deleteDictionaryById = async (DictionaryID) => {
    const Dictionary = await getDictionaryById(DictionaryID);
    if (!Dictionary) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Dictionary not found');
    }
    await Dictionary.remove();
    return Dictionary;
  };
  
  module.exports = {
    createDictionary,
    queryDictionarys,
    getDictionaryByWord,
    getDictionaryById,
    updateDictionaryById,
    deleteDictionaryById,
  };