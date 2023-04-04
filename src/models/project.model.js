const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { PROJECT_STATUS, PROJECT_ROLE } = require('../contants/status');
const LANGUAGE = require('../contants/language');
const SCOPE = require('../contants/scope');

const projectSchema = mongoose.Schema(
  {
    project_name: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    source_language: {
      type: String,
      enum: Object.values(LANGUAGE),
      required: true,
    },
    target_language: {
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
