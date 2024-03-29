const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const wordSchema = mongoose.Schema(
  {
    dictionaryID: {
      type: String,
      required: true,
    },
    word: {
      type: String,
      required: true,
      index: true,
    },
    mean: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

wordSchema.plugin(toJSON);
wordSchema.plugin(paginate);

const word = mongoose.model('Word', wordSchema);

module.exports = word;
