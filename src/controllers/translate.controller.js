const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { translateService } = require('../services');
const { translating } = require('../python');

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

function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3, char4;

  out = '';
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
        break;
      case 15:
        // 1111 0xxx 10xx xxxx 10xx xxxx 10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        char4 = array[i++];
        out += String.fromCodePoint(((c & 0x07) << 18) | ((char2 & 0x3f) << 12) | ((char3 & 0x3f) << 6) | (char4 & 0x3f));

        break;
    }

    return out;
  }
}

const translateMachineSentence = catchAsync(async (req, res) => {
  const { sentence, target } = req.body;
  // call python machine  translate
  const data = await translating(['translate_sent', Buffer.from(sentence, 'utf-8'), target]);
  const text = data[0].slice(2, -1);
  console.log(text);
  const bufferText = Buffer.from(text);
  console.log('result= ', Utf8ArrayToStr(bufferText));
  console.log(decodeURIComponent(escape('\xc4\x90\xc3\xa2y l\xc3\xa0 t\xc3\xbai c\xe1\xbb\xa7a t\xc3\xb4i')));
  console.log(decodeURIComponent(escape(text)));
  res.send({ status: true, data: text });
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
