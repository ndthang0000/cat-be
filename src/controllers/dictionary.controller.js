const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { DictionaryService } = require('../services');

const createDictionary = catchAsync(async (req, res) => {
  const Dictionary = await DictionaryService.createDictionary(req.body);
  res.status(httpStatus.CREATED).send(Dictionary);
});

const getDictionaries = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await DictionaryService.queryDictionaries(filter, options);
  res.send(result);
});

const getDictionary = catchAsync(async (req, res) => {
  const Dictionary = await DictionaryService.getDictionaryById(req.params.DictionaryId);
  if (!Dictionary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Dictionary not found');
  }
  res.send(Dictionary);
});

const updateDictionary = catchAsync(async (req, res) => {
  const Dictionary = await DictionaryService.updateDictionaryById(req.params.DictionaryId, req.body);
  res.send(Dictionary);
});

const deleteDictionary = catchAsync(async (req, res) => {
  await DictionaryService.deleteDictionaryById(req.params.DictionaryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createDictionary,
    getDictionaries,
    getDictionary,
    updateDictionary,
    deleteDictionary,
  };