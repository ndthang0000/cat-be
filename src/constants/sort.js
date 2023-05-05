const SORT_PROJECT = {
  Oldest: 'createdAt',
  Newest: 'createdAt:desc',
  'Last Update': 'updatedAt:desc',
  Priority: 'priority:desc',
  'Project Name': 'projectName',
  'Descending File': 'lengthFile',
  'Ascending File': 'lengthFile:desc',
};

module.exports = {
  SORT_PROJECT,
};
