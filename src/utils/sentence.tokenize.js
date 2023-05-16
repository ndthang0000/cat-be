const Tokenizer = require('sentence-tokenizer');

const tokenizeSentence = (fileId, textFile) => {
  const tokenizer = new Tokenizer(fileId);
  tokenizer.setEntry(textFile);
  return tokenizer.getSentences();
};

module.exports = {
  tokenizeSentence,
};
