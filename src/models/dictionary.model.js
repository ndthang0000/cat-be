const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const dictionarySchema = mongoose.Schema(
  {
    dictionaryName: {
      type: String,
    },
    dictionaryCode: {
      type: String,
      required: true,
    },
    sourceLanguage: {
      type: String,
      required: true,
    },
    targetLanguage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

dictionarySchema.plugin(toJSON);
dictionarySchema.plugin(paginate);

const dictionary = mongoose.model('dictionary', dictionarySchema);

module.exports = dictionary;
