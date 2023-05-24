const httpStatus = require('http-status');
const { translate, Sentence } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const { SENTENCE_STATUS } = require('../constants/status');

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

/**
 * Get word trans by pj id
 * @param {string} projectID
 * @returns {Promise<translate>}
 */
const getWordsTransByProjectID = async (projectID) => {
  return translate.find({ project_id: projectID });
};

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
  const translate = await getWordTransById(wordID);
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
  const translate = await getWordTransById(wordID);
  if (!translate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'word not found');
  }
  await translate.remove();
  return translate;
};

const statisticFile = async (fileId) => {
  const data = await Sentence.aggregate([
    {
      $match: {
        fileId: mongoose.Types.ObjectId(fileId),
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
  const allStatus = Object.values(SENTENCE_STATUS).map((item) => {
    return { status: item, count: 0 };
  });
  return Object.assign(
    allStatus,
    data.map((item) => {
      return { status: item._id, count: item.count };
    })
  );
};

module.exports = {
  createWordTrans,
  queryWordsTrans,
  getWordsTransByProjectID,
  getWordTransById,
  updateWordTransById,
  deleteWordTransById,
  statisticFile,
};
