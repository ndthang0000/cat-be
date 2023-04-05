const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { translationMemoryService } = require('../services');

const createTranslationMemory = catchAsync(async (req, res) => {
  const translationMemory = await translationMemoryService.createTranslationMemory(req.body);
  res.status(httpStatus.CREATED).send(translationMemory);
});

const getTranslationMemories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await translationMemoryService.queryTranslationMemories(filter, options);
  res.send(result);
});

const getTranslationMemory = catchAsync(async (req, res) => {
  const translationMemory = await translationMemoryService.getTranslationMemoryById(req.params.TranslationMemoryId);
  if (!translationMemory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'translationMemory not found');
  }
  res.send(translationMemory);
});

const getTranslationMemoryByCode = catchAsync(async (req, res) => {
  const translationMemory = await translationMemoryService.getTranslationMemoryByCode(req.params.codeTrans);
  if (!translationMemory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'translationMemory not found');
  }
  res.send(translationMemory);
});

const updateTranslationMemory = catchAsync(async (req, res) => {
  const translationMemory = await translationMemoryService.updateTranslationMemoryById(
    req.params.TranslationMemoryId,
    req.body
  );
  res.send(translationMemory);
});

const deleteTranslationMemory = catchAsync(async (req, res) => {
  await translationMemoryService.deleteTranslationMemoryById(req.params.TranslationMemoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTranslationMemory,
  getTranslationMemories,
  getTranslationMemory,
  getTranslationMemoryByCode,
  updateTranslationMemory,
  deleteTranslationMemory,
};
