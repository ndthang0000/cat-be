const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { translateService } = require('../services');

const createWordTrans = catchAsync(async (req, res) => {
  const word = await translateService.createWordTrans(req.body);
  res.status(httpStatus.CREATED).send(word);
});

const getWordsTrans = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await translateService.queryWordsTrans(filter, options);
  res.send(result);
});

const getWordsTransByProjectID = catchAsync(async (req, res) => {
  const result = await translateService.getWordsTransByProjectID(req.params.projectId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'word not found');
  }
  res.send(result);
});

const getWordTrans = catchAsync(async (req, res) => {
  const word = await translateService.getWordTransById(req.params.wordId);
  if (!word) {
    throw new ApiError(httpStatus.NOT_FOUND, 'word not found');
  }
  res.send(word);
});

const updateWordTrans = catchAsync(async (req, res) => {
  const word = await translateService.updateWordTransById(req.params.wordId, req.body);
  res.send(word);
});

const deleteWordTrans = catchAsync(async (req, res) => {
  await translateService.deleteWordTransById(req.params.wordId);
  res.status(httpStatus.NO_CONTENT).send();
});

const translateMachineSentence = catchAsync(async (req, res) => {
  const { sentence } = req.body;
  // call python machine  translate
  res.send({ status: true, data: `Success ${sentence}` });
});

const getWordDictionary = catchAsync(async (req, res) => {
  const { word } = req.body;
  // call python machine  translate
  res.send({
    status: true,
    data: [`Thành công ${word}`, `word: ${word}`],
  });
});

const fuzzyMatching = catchAsync(async (req, res) => {
  const { sentence } = req.body;
  // call python machine  translate
  res.send({ status: true, data: [`Fuzzy matching ${sentence}`, 'Hi...'] });
});

module.exports = {
  createWordTrans,
  getWordsTrans,
  getWordsTransByProjectID,
  getWordTrans,
  updateWordTrans,
  deleteWordTrans,
  translateMachineSentence,
  getWordDictionary,
  fuzzyMatching,
};
