const httpStatus = require('http-status');
const { translate } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a word translate
 * @param {Object} wordBody
 * @returns {Promise<translate>}
 */
const createWordTrans = async (wordBody) => {
    return translate.create(wordBody);
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
  const queryWordsTrans = async (filter, options) => {
    const words = await translate.paginate(filter, options);
    return words;
  };

  // /**
  //  * Get word by word
  //  * @param {string} word
  //  * @returns {Promise<word>}
  //  */
  // const getwordByWord = async (word) => {
  //   return word.findOne({ word });
  // };

   /**
   * Get word by ID
   * @param {ObjectId} ID
   * @returns {Promise<translate>}
   */
   const getWordTransById = async (ID) => {
    return translate.findById(ID);
  };
  
  /**
   * Update word by ID
   * @param {ObjectId} wordID
   * @param {Object} updateBody
   * @returns {Promise<translate>}
   */
  const updateWordTransById = async (wordID, updateBody) => {
    const translate = await getWordById(wordID);
    if (!translate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'word not found');
    }
    Object.assign(translate, updateBody);
    await translate.save();
    return translate;
  };
  
  /**
   * Delete word by ID
   * @param {ObjectId} wordID
   * @returns {Promise<translate>}
   */
  const deleteWordTransById = async (wordID) => {
    const translate = await getWordById(wordID);
    if (!translate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'word not found');
    }
    await translate.remove();
    return translate;
  };
  
  module.exports = {
    createWordTrans,
    queryWordsTrans,
    // getwordByWord,
    getWordTransById,
    updateWordTransById,
    deleteWordTransById,
  };