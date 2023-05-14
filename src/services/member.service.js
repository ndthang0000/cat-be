const { Member } = require('../models');

const createNewMember = async (data) => {
  return await new Member(data).save();
};

module.exports = {
  createNewMember,
};
