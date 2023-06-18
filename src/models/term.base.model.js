const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const termBaseSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    textSrc: {
      type: String,
      require: true,
    },
    textTarget: {
      type: String,
    },
    language: {
      // template vi-en, en-vi
      type: String,
    },
    dictionaryCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
termBaseSchema.plugin(toJSON);
termBaseSchema.plugin(paginate);

const TermBase = mongoose.model('TermBase', termBaseSchema);

module.exports = TermBase;
