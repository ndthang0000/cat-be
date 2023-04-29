const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService } = require('../services');
const { PROJECT_ROLE } = require('../constants/status');

const createProject = catchAsync(async (req, res) => {
  req.body.userId = req.user.userId;
  const members = [
    {
      userId: req.user._id,
      role: PROJECT_ROLE.PROJECT_MANAGER,
    },
  ];
  req.body.members = members;
  const project = await projectService.createProject(req.body);
  res.status(httpStatus.CREATED).send(project);
});

const getProjects = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await projectService.queryProjects(filter, options);
  res.send(result);
});

const getProjectsByUserID = catchAsync(async (req, res) => {
  const result = await projectService.getProjectByUserID(req.params.userId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'project not found');
  }
  res.send(result);
});

const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'project not found');
  }
  res.send(project);
});

const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectById(req.params.projectId, req.body);
  res.send(project);
});

const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProjectById(req.params.projectId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProject,
  getProjects,
  getProjectsByUserID,
  getProject,
  updateProject,
  deleteProject,
};
