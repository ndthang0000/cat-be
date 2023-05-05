const SORT_PROJECT = {
  'OLD TO NEW': 'createdAt',
  'NEW TO OLD': 'createdAt:desc',
  'LAST UPDATE': 'updatedAt:desc',
  PRIORITY: 'priority:desc',
  NAME: 'projectName',
  'DESCENDING FILE': 'lengthFile',
  'ASCENDING FILE': 'lengthFile:desc',
};

module.exports = {
  SORT_PROJECT,
};
