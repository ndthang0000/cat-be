const WordExtractor = require('word-extractor');
const extractor = new WordExtractor();

const readFileWord = async (name) => {
  const extracted = await extractor.extract(`uploads/${name}`);
  return extracted.getBody();
};

module.exports = readFileWord;
//readFileWord('Hello.docx');
