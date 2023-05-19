const mongoose = require('mongoose');
const { toJSON, paginate, paginateAgg } = require('./plugins');
const ACTIVITY = require('../constants/activity');

const ActivitySchema = mongoose.Schema(
  {
    comment: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
    },
    action: {
      type: String,
      enum: Object.values(ACTIVITY),
    },
    projectId: {
      type: String,
    },
    fileId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ActivitySchema.plugin(toJSON);
ActivitySchema.plugin(paginate);
ActivitySchema.plugin(paginateAgg);

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;
