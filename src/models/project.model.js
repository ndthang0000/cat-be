const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const projectSchema = mongoose.Schema({
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
    required: true,
  },
  target_language: {
    type: String,
    required: true,
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
