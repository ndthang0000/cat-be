const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dictionaryService } = require('../services');

const createDictionary = catchAsync(async (req, res) => {
  const dictionary = await dictionaryService.createDictionary(req.body);
  res.status(httpStatus.CREATED).send(dictionary);
});

const getDictionaries = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await dictionaryService.queryDictionaries(filter, options);
  res.send(result);
});

const getDictionariesByCode = catchAsync(async (req, res) => {
  const result = await dictionaryService.getDictionariesByCode(req.params.codeDic);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dictionary not found');
  }
  res.send(result);
});

const getDictionary = catchAsync(async (req, res) => {
  const dictionary = await dictionaryService.getDictionaryById(req.params.dictionaryId);
  if (!dictionary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dictionary not found');
  }
  res.send(dictionary);
});

const updateDictionary = catchAsync(async (req, res) => {
  const dictionary = await dictionaryService.updateDictionaryById(req.params.dictionaryId, req.body);
  res.send(dictionary);
});

const deleteDictionary = catchAsync(async (req, res) => {
  await dictionaryService.deleteDictionaryById(req.params.dictionaryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDictionary,
  getDictionaries,
  getDictionary,
  getDictionariesByCode,
  updateDictionary,
  deleteDictionary,
};
