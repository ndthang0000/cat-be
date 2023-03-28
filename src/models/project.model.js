const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const SCOPE = require('../contants/scope');
const { PROJECT_STATUS } = require('../contants/status');
const LANGUAGE = require('../contants/language');

const projectSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      require: true,
    },
    domain: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    shared: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    scope: {
      type: String,
      enum: Object.values(SCOPE),
      default: SCOPE.PUBLIC,
    },
    src: {
      type: String,
      enum: Object.values(LANGUAGE),
      require: true,
    },
    dest: {
      type: String,
      enum: Object.values(LANGUAGE),
      require: true,
    },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.INPROGRESS,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
