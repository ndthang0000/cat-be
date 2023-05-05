const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { SENTENCE_STATUS } = require('../constants/status');

const sentenceSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'file',
      required: true,
    },
    textSrc: {
      type: String,
      require: true,
    },
    textDist: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(SENTENCE_STATUS),
      default: SENTENCE_STATUS.TRANSLATING,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
sentenceSchema.plugin(toJSON);
sentenceSchema.plugin(paginate);

const Sentence = mongoose.model('Sentence', sentenceSchema);

module.exports = Sentence;
