const mongoose = require('mongoose');
const { toJSON, paginate, paginateAgg } = require('./plugins');
const { PROJECT_STATUS, PROJECT_ROLE } = require('../constants/status');
const LANGUAGE = require('../constants/language');
const SCOPE = require('../constants/scope');
const slug = require('mongoose-slug-generator');
const mongoose_delete = require('mongoose-delete');

mongoose.plugin(slug);

const fileSchema = mongoose.Schema(
  {
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    nameFile: {
      type: String,
    },
    uniqueNameFile: {
      type: String,
    },
    quantitySentence: {
      type: Number,
      default: 0,
    },
    invalidFile: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'https://images-storage-bucket.s3.ap-southeast-1.amazonaws.com/upload/avatar/icon/word.png',
    },
    isTokenizeSentence: {
      type: Boolean,
      default: false,
    },
    sourceLanguage: {
      type: String,
      enum: Object.values(LANGUAGE),
      //required: true,
    },
    targetLanguage: {
      type: String,
      enum: Object.values(LANGUAGE),
      //required: true,
    },
    percentComplete: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    autoApplyTermBase: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.plugin(toJSON);
fileSchema.plugin(paginate);
fileSchema.plugin(paginateAgg);
fileSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const File = mongoose.model('File', fileSchema);

module.exports = File;
