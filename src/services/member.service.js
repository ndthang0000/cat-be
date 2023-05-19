const { Member, Activity } = require('../models');
const ACTIVITY = require('../') = require('../constants/activity');

const createNewMember = async (data) => {
  const mem = await new Member(data).save();
  await data.save();
  const activity = await new Activity();
  activity.userId = data.userId;
  activity.fileId = '';
  activity.projectId = '';
  activity.action = ACTIVITY.ADD_MEMBER;
  activity.comment = 'add new member';
  await activity.save();
  return mem
};

module.exports = {
  createNewMember,
};
