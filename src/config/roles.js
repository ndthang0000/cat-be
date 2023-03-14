const allRoles = {
  user: ['getDictionaries', 'manageDictionaries'],
  admin: ['getTranslation','getUsers', 'manageUsers','getDictionaries', 'manageDictionaries','getTranslationMemories', 'manageTranslationMemories']
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
