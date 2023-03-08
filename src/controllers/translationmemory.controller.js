const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { TranslationMemoryService } = require('../services');

const createTranslationMemory = catchAsync(async (req, res) => {
  const TranslationMemory = await TranslationMemoryService.createTranslationMemory(req.body);
  res.status(httpStatus.CREATED).send(TranslationMemory);
});

const getTranslationMemories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await TranslationMemoryService.queryTranslationMemories(filter, options);
  res.send(result);
});

const getTranslationMemory = catchAsync(async (req, res) => {
  const TranslationMemory = await TranslationMemoryService.getTranslationMemoryById(req.params.TranslationMemoryId);
  if (!TranslationMemory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TranslationMemory not found');
  }
  res.send(TranslationMemory);
});

const updateTranslationMemory = catchAsync(async (req, res) => {
  const TranslationMemory = await TranslationMemoryService.updateTranslationMemoryById(req.params.TranslationMemoryId, req.body);
  res.send(TranslationMemory);
});

const deleteTranslationMemory = catchAsync(async (req, res) => {
  await TranslationMemoryService.deleteTranslationMemoryById(req.params.TranslationMemoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createTranslationMemory,
    getTranslationMemories,
    getTranslationMemory,
    updateTranslationMemory,
    deleteTranslationMemory,
  };