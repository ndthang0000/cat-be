const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService } = require('../services');

const createDictionary = catchAsync(async (req, res) => {
  const dictionary = await projectService.createDictionary(req.body);
  res.status(httpStatus.CREATED).send(dictionary);
});

const getDictionaries = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await projectService.queryDictionaries(filter, options);
  res.send(result);
});

const getDictionary = catchAsync(async (req, res) => {
  const dictionary = await projectService.getDictionaryById(req.params.projectId);
  if (!dictionary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dictionary not found');
  }
  res.send(dictionary);
});

const updateDictionary = catchAsync(async (req, res) => {
  const dictionary = await projectService.updateDictionaryById(req.params.projectId, req.body);
  res.send(dictionary);
});

const deleteDictionary = catchAsync(async (req, res) => {
  await projectService.deleteDictionaryById(req.params.projectId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDictionary,
  getDictionaries,
  getDictionary,
  updateDictionary,
  deleteDictionary,
};
