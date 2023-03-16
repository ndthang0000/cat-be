const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const dictionarySchema = mongoose.Schema({
  dictionary_name: {
    type: String,
  },
  dictionary_code: {
    type: String,
    required: true,
  },
  source_language: {
    type: String,
    required: true,
  },
  target_language: {
    type: String,
    required: true,
  },
});

dictionarySchema.plugin(toJSON);
dictionarySchema.plugin(paginate);

const dictionary = mongoose.model('dictionary', dictionarySchema);

module.exports = dictionary;
