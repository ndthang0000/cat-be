const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const translationMemorySchema = mongoose.Schema(
  {
    translationMemoryCode: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      index: true,
    },
    target: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

translationMemorySchema.plugin(toJSON);
translationMemorySchema.plugin(paginate);

const translationMemory = mongoose.model('TranslationMemory', translationMemorySchema);

module.exports = translationMemory;
