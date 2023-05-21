const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { translateService, projectService } = require('../services');
const { translating } = require('../python');
const config = require('../config/config');
const axios = require('axios');
const { PROJECT_ROLE, SENTENCE_STATUS, PROJECT_STATUS } = require('../constants/status');

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
  const { sentence, target } = req.body;
  try {
    const data = await axios.post(`${config.domain.pythonDomain}/translate-one-sentence`, { sentence, target });
    res.status(200).json({ status: true, data: data.data.data });
  } catch (error) {
    res.status(200).json({ status: false, data: null });
    console.log(error);
  }
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

const applyMachineForAllSentence = catchAsync(async (req, res) => {
  const { projectId, fileId } = req.body;
  const { _id } = req.user;
  try {
    const findProject = await projectService.getProjectById(projectId);
    if (!findProject) {
      return res.status(200).json({ status: false, message: `Project invalid` });
    }

    const checkPermission = projectService.checkPermissionOfUser(findProject, _id, PROJECT_ROLE.DEVELOPER);
    if (!checkPermission.status) {
      return res.send(checkPermission);
    }

    const findExitFile = await projectService.getOneFileOfProjectById(fileId);

    if (!findExitFile) {
      return res.status(200).json({ status: false, message: `File invalid` });
    }

    const sentences = await projectService.getAllSentenceOfFileOfProject(projectId, fileId);

    try {
      const data = await axios.post(`${config.domain.pythonDomain}/translate-many-sentence`, {
        list_sentence: sentences.map((item) => item.textSrc),
        target: findProject.targetLanguage,
      });
      const newListTranslate = data.data.data;
      for (let i = 0; i < sentences.length; i++) {
        sentences[i].textTarget = newListTranslate[i];
        sentences[i].status = SENTENCE_STATUS.TRANSLATING;
        await sentences[i].save();
      }
      res.status(200).json({ status: true, data: 1 });
    } catch (error) {
      res.status(200).json({ status: false, data: null, message: 'Something went wrong when translating' });
    }
  } catch (error) {
    res.status(200).json({ status: false, data: null });
    console.log(error);
  }
});

const applyMachineForOneSentence = catchAsync(async (req, res) => {
  const { projectId, fileId, sentenceId } = req.body;
  const { _id } = req.user;
  try {
    const findProject = await projectService.getProjectById(projectId);
    if (!findProject) {
      return res.status(200).json({ status: false, message: `Project invalid` });
    }

    const checkPermission = projectService.checkPermissionOfUser(findProject, _id, PROJECT_ROLE.DEVELOPER);
    if (!checkPermission.status) {
      return res.send(checkPermission);
    }

    const findExitFile = await projectService.getOneFileOfProjectById(fileId);

    if (!findExitFile) {
      return res.status(200).json({ status: false, message: `File invalid` });
    }

    const findSentence = await projectService.getOneSentenceOfFileOfProjectById(sentenceId);

    if (!findSentence) {
      return res.status(200).json({ status: false, message: `Sentence invalid` });
    }

    try {
      const data = await axios.post(`${config.domain.pythonDomain}/translate-one-sentence`, {
        sentence: findSentence.textSrc,
        target: findProject.targetLanguage,
      });
      findSentence.textTarget = data.data.data;
      findSentence.status = SENTENCE_STATUS.TRANSLATING;
      await findSentence.save();
      res.status(200).json({ status: true, data: true });
    } catch (error) {
      res.status(200).json({ status: false, data: null, message: 'Something went wrong when translating' });
    }
  } catch (error) {
    res.status(200).json({ status: false, data: null });
    console.log(error);
  }
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
  applyMachineForAllSentence,
  applyMachineForOneSentence,
};
