const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService } = require('../services');
const { PROJECT_ROLE } = require('../constants/status');
const { uploadFile } = require('../utils/upload.file');
const ObjectId = require('mongoose').Types.ObjectId;

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

const getDetailProject = catchAsync(async (req, res) => {
  const slug = pick(req.params, ['slug']);
  const result = await projectService.getDetailProject(slug);
  res.send(result);
});

const uploadFileToProject = catchAsync(async (req, res) => {
  const { projectId } = req.body;
  const { _id } = req.user;
  if (!projectId) {
    return res.send({ status: false, message: 'Project Id is required' });
  }
  if (!ObjectId.isValid(projectId)) {
    return res.send({ status: false, message: 'Project Id is invalid' });
  }
  const findProject = await projectService.getProjectById(projectId);
  if (!findProject) {
    return res.send({ status: false, message: 'Project not found' });
  }
  // check quyền của user có đủ ko
  const permissionUser = findProject.members.find((item) => String(item.userId) == String(_id));
  if (!permissionUser || permissionUser.role == PROJECT_ROLE.GUEST) {
    return res.send({ status: false, message: 'Permission Denied' });
  }
  for (let i = 0; i < req.files.length; i++) {
    const dataUpload = await uploadFile(req.files[i].path, 'files/' + req.files[i].originalname);
    const insertFile = await projectService.createNewFileToProject({
      description: `Let's add description`,
      url: dataUpload.Location,
      nameFile: req.files[i].originalname,
    });
    findProject.files.push(insertFile._id);
  }
  await findProject.save();
  res.send({ status: true, message: `Upload ${req.files.length} to project` });
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
  getDetailProject,
  uploadFileToProject,
};
