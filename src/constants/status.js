const SENTENCE_STATUS = {
  TRANSLATING: 'TRANSLATING',
  CONFIRM: 'CONFIRM',
  UN_TRANSLATE: 'UN_TRANSLATE',
  REVIEW: 'REVIEW',
};

const PROJECT_STATUS = {
  INPROGRESS: 'INPROGRESS',
  CANCEL: 'CANCEL',
  FINISH: 'FINISH',
};

const PROJECT_ROLE = {
  PROJECT_MANAGER: 'PROJECT MANAGER',
  DEVELOPER: 'EDITOR',
  GUEST: 'REVIEWER',
  // OWNER: 'OWNER',
};

const getOneNumberRoleProject = (role) => {
  // if (role == PROJECT_ROLE.OWNER) {
  //   return 1;
  // }
  if (role == PROJECT_ROLE.PROJECT_MANAGER) {
    return 2;
  }
  if (role == PROJECT_ROLE.DEVELOPER) {
    return 3;
  }
  if (role == PROJECT_ROLE.GUEST) {
    return 4;
  }
};

module.exports = {
  SENTENCE_STATUS,
  PROJECT_STATUS,
  PROJECT_ROLE,
  getOneNumberRoleProject,
};
