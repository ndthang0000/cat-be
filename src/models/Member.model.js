const mongoose = require('mongoose');
const { toJSON, paginate, paginateAgg } = require('./plugins');
const { PROJECT_ROLE } = require('../constants/status');

const MemberSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
    },
    role: {
      type: String,
      enum: Object.values(PROJECT_ROLE),
      default: PROJECT_ROLE.OWNER,
    },
  },
  {
    timestamps: true,
  }
);

MemberSchema.plugin(toJSON);
MemberSchema.plugin(paginate);
MemberSchema.plugin(paginateAgg);

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
