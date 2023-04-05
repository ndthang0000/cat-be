const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { PROJECT_STATUS, PROJECT_ROLE } = require('../contants/status');
const LANGUAGE = require('../contants/language');
const SCOPE = require('../contants/scope');

const projectSchema = mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    sourceLanguage: {
      type: String,
      enum: Object.values(LANGUAGE),
      required: true,
    },
    targetLanguage: {
      type: String,
      enum: Object.values(LANGUAGE),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.INPROGRESS,
    },
    scope: {
      type: String,
      enum: Object.values(SCOPE),
      default: SCOPE.PUBLIC,
    },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: Object.values(PROJECT_ROLE), default: PROJECT_ROLE.DEVELOPER },
      },
    ],
    files: [{ type: String }],
    domain: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

const project = mongoose.model('project', projectSchema);

module.exports = project;
