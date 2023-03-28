const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const SCOPE = require('../contants/scope');
const { SENTENCE_STATUS } = require('../contants/status');

const sentenceSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Project',
      required: true,
    },
    textSrc: {
      type: String,
      require: true,
    },
    textDist: {
      type: String,
      require: true,
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
