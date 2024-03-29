const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { translateService, projectService, TranslationMemoryService } = require('../services');
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
  const { sentence, projectId } = req.body;

  const findProject = await projectService.getProjectById(projectId);
  if (!findProject) {
    return res.status(200).json({ status: false, message: `Project invalid` });
  }

  // call python machine  translate
  const data = await axios.post(`${config.domain.pythonDomain}/dictionary`, {
    sentence,
    languageToLanguage: findProject.sourceLanguage,
  });

  const result = [];

  for (const item of data.data.data) {
    const obj = {};
    const tokens = item.split('//<br>');
    obj.word = tokens[0].trim();
    obj.description = tokens[1].split('<br>');
    for (let i = 0; i < obj.description.length; i++) {
      obj.description[i] = obj.description[i].trim();
    }
    result.push(obj);
  }

  res.send({ status: true, data: result });
});

const fuzzyMatching = catchAsync(async (req, res) => {
  const { sentence, projectId, fileId } = req.body;
  const { _id } = req.user;

  try {
    const findProject = await projectService.getProjectById(projectId);
    if (!findProject) {
      return res.status(200).json({ status: false, message: `Project invalid` });
    }

    const findFile = await projectService.getOneFileOfProjectById(fileId);
    if (!findFile) {
      return res.status(200).json({ status: false, message: `File invalid` });
    }

    const checkPermission = projectService.checkPermissionOfUser(findProject, _id, PROJECT_ROLE.DEVELOPER);
    if (!checkPermission.status) {
      return res.send(checkPermission);
    }

    let keyName = '';
    if (findProject.isTmReverse) keyName = 'target';
    else keyName = 'source';

    const body = {
      query: {
        bool: {
          must: {
            match: {
              [keyName]: sentence,
            },
          },
          filter: {
            match: {
              translationMemoryCode: findProject.translationMemoryCode,
            },
          },
        },
      },
    };

    const response = await axios.post('http://localhost:9200/translationmemories/_search', body, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = response.data.hits.hits;

    const dataTM = data.map((item) => item._source);
    const sentence2 = dataTM.map((item) => item.source);

    if (sentence2.length != 0) {
      const dataTMWithSimilarity = await axios.post(
        `${config.domain.pythonDomain}/similarity`,
        {
          language: findProject.sourceLanguage,
          sentence1: sentence,
          list_sentence2: sentence2,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      dataTMWithSimilarity.data.data.forEach((item, index) => {
        dataTM[index].similarity = item;
      });
    }

    const bodyTB = {
      query: {
        bool: {
          must: {
            match: {
              [keyName]: sentence,
            },
          },
          filter: {
            match: {
              dictionaryCode: findProject.dictionaryCode,
            },
          },
        },
      },
    };
    const responseTB = await axios.post('http://localhost:9200/term-base/_search', bodyTB, {
      headers: { 'Content-Type': 'application/json' },
    });
    const dataTB = responseTB.data.hits.hits.map((item) => item._source);

    res.send({ status: true, dataTM, dataTB });
  } catch (error) {}
});

const detectTermBase = catchAsync(async (req, res) => {
  const { sentence, projectId } = req.body;
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

    let keyName = '';
    if (findProject.isDictReverse) keyName = 'target';
    else keyName = 'source';

    const body = {
      query: {
        bool: {
          must: {
            match: {
              [keyName]: sentence,
            },
          },
          filter: {
            match: {
              dictionaryCode: findProject.dictionaryCode,
            },
          },
        },
      },
    };
    const response = await axios.post('http://localhost:9200/term-base/_search', body, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = response.data.hits.hits.map((item) => item._source);
    res.send({ status: true, data });
  } catch (error) {}
});

const applyMachineForAllSentence = catchAsync(async (req, res) => {
  const { projectId, fileId, optionMachine } = req.body;
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

    const sentences = await projectService.filterSentence({ projectId, fileId, status: SENTENCE_STATUS.UN_TRANSLATE });
    if (sentences.length == 0) {
      return res.status(200).json({ status: true, message: `You have been translated all sentence before` });
    }
    try {
      const data = await axios.post(`${config.domain.pythonDomain}/translate-many-sentence`, {
        list_sentence: sentences.map((item) => item.textSrc),
        target: findProject.targetLanguage,
      });
      const newListTranslate = data.data.data;
      for (let i = 0; i < sentences.length; i++) {
        sentences[i].textTarget = newListTranslate[i];
        sentences[i].status = optionMachine == 1 ? SENTENCE_STATUS.TRANSLATING : SENTENCE_STATUS.CONFIRM;
        await sentences[i].save();
      }
      findExitFile.percentComplete = 100;
      await findExitFile.save();
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

      let tm = {};
      if (findSentence.tmId) {
        // if this sentence is re-confirmed, update the tm
        let keyName = '';
        if (findProject.isTmReverse) keyName = 'source';
        else keyName = 'target';

        tm = await TranslationMemoryService.getTranslationMemoryById(findSentence.tmId);
        tm[keyName] = data.data.data;
        tm = await tm.save();
      } else {
        // if this sentence is comfirmed the first time, create new tm
        const tmBody = {
          translationMemoryCode: findProject.translationMemoryCode,
          source: findProject.isTmReverse ? data.data.data : findSentence.textSrc,
          target: findProject.isTmReverse ? findSentence.textSrc : data.data.data,
        };
        tm = await TranslationMemoryService.createTranslationMemory(tmBody);
        findSentence.tmId = tm._id;
      }

      findSentence.textTarget = data.data.data || findSentence.textSrc;
      findSentence.status = SENTENCE_STATUS.CONFIRM;
      findExitFile.percentComplete =
        ((await projectService.countCompleteSentence(fileId)) / findExitFile.quantitySentence) * 100;
      console.log(findExitFile);
      findExitFile.percentComplete = findExitFile.percentComplete.toFixed(2);
      await findSentence.save();
      await findExitFile.save();

      // create or update
      await axios.put(`http://localhost:9200/translationmemories/_doc/${tm._id}`, tm, {
        headers: { 'Content-Type': 'application/json' },
      });

      res.status(200).json({ status: true, data: findSentence.textTarget });
    } catch (error) {
      res.status(200).json({ status: false, data: null, message: 'Something went wrong when translating' });
    }
  } catch (error) {
    res.status(200).json({ status: false, data: null });
    console.log(error);
  }
});

const confirmSentence = catchAsync(async (req, res) => {
  const { projectId, fileId, sentenceId, data } = req.body;
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

    let tm = {};
    if (findSentence.tmId) {
      // if this sentence is re-confirmed, update the tm
      let keyName = '';
      if (findProject.isTmReverse) keyName = 'source';
      else keyName = 'target';

      tm = await TranslationMemoryService.getTranslationMemoryById(findSentence.tmId);
      tm[keyName] = data;
      tm = await tm.save();
    } else {
      // if this sentence is comfirmed the first time, create new tm
      const tmBody = {
        translationMemoryCode: findProject.translationMemoryCode,
        source: findProject.isTmReverse ? data : findSentence.textSrc,
        target: findProject.isTmReverse ? findSentence.textSrc : data,
      };
      tm = await TranslationMemoryService.createTranslationMemory(tmBody);
      findSentence.tmId = tm._id;
    }

    findSentence.textTarget = data;
    findSentence.status = SENTENCE_STATUS.CONFIRM;
    findExitFile.percentComplete =
      ((await projectService.countCompleteSentence(fileId)) / findExitFile.quantitySentence) * 100;
    console.log(findExitFile);
    findExitFile.percentComplete = findExitFile.percentComplete.toFixed(2);
    await findSentence.save();
    await findExitFile.save();

    // create or update
    await axios.put(`http://localhost:9200/translationmemories/_doc/${tm._id}`, tm, {
      headers: { 'Content-Type': 'application/json' },
    });

    res.status(200).json({ status: true, data: true });
  } catch (error) {
    res.status(200).json({ status: false, data: null });
    console.log(error);
  }
});

const statisticFile = catchAsync(async (req, res) => {
  const { fileId } = req.body;
  const data = await translateService.statisticFile(fileId);
  res.status(200).json({ status: true, data });
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
  confirmSentence,
  statisticFile,
  detectTermBase,
};
