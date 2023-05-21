const { Member, Activity } = require('../models');
const ACTIVITY = require('../constants/activity');

const createNewMember = async (data) => {
  return await new Member(data).save();
};

module.exports = {
  createNewMember,
};
