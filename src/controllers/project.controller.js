const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService } = require('../services');
const { PROJECT_ROLE } = require('../constants/status');
const { uploadFile } = require('../utils/upload.file');
const { pythonScript } = require('../python');
const { readFileWord } = require('../readfile/readfileWord');
const logger = require('../config/logger');
const { SORT_PROJECT } = require('../constants/sort');
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
  const { _id, userId } = req.user;
  const filters = pick(req.query, ['search', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const lastFilter = {};
  if (filters.type == 'All') {
    lastFilter.members = { $elemMatch: { userId: _id } };
  } else if (filters.type == 'Individual') {
    lastFilter.userId = userId;
  }
  if (filters.search) {
    lastFilter.$or = [{ projectName: { $regex: filters.search } }, { description: { $regex: filters.search } }];
  }
  const result = await projectService.queryProjects(lastFilter, options);
  res.send(result);
});

const getDetailProject = catchAsync(async (req, res) => {
  const slug = pick(req.params, ['slug']);
  const result = await projectService.getDetailProject(slug);
  res.send(result);
});

const openFileOfProject = catchAsync(async (req, res) => {
  const { projectId, fileId } = req.body;
  const { _id } = req.user;
  const findProject = await projectService.getProjectById(projectId);
  if (!findProject) {
    return res.status(200).json({ status: false, message: `Project invalid` });
  }
  const checkPermission = projectService.checkPermissionOfUser(findProject, _id, PROJECT_ROLE.GUEST);
  if (!checkPermission.status) {
    return res.send(checkPermission);
  }
  if (findProject.files.filter((item) => String(item) == fileId).length == 0) {
    return res.status(200).json({ status: false, message: `File not belong to project [${findProject.name}]` });
  }
  const findFile = await projectService.getOneFileOfProjectById(fileId);
  if (!findFile) {
    return res.status(200).json({ status: false, message: `File not found` });
  }
  if (!findFile.isTokenizeSentence) {
    try {
      const text = await readFileWord(findFile.uniqueNameFile);
      const dataSentence = await pythonScript(['sentence_tokenize', text]);
      const dataInsertDB = dataSentence.map((item) => {
        return {
          projectId,
          fileId,
          textSrc: item,
        };
      });
      const results = await projectService.createManySentenceOfFileOfProject(dataInsertDB);
      findFile.isTokenizeSentence = true;
      await findFile.save();
      return res.status(200).json({ status: true, data: results });
    } catch (error) {
      logger.error(`ERR Tokenize or Readfile: fileId: ${findFile._id}`);
    }
  }
  const data = await projectService.getAllSentenceOfFileOfProject(projectId, fileId);
  res.send({ status: true, data });
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
  const checkPermission = projectService.checkPermissionOfUser(findProject, _id, PROJECT_ROLE.PROJECT_MANAGER);
  if (!checkPermission.status) {
    return res.send(checkPermission);
  }

  for (let i = 0; i < req.files.length; i++) {
    const dataUpload = await uploadFile(req.files[i].path, 'files/' + req.files[i].filename);
    const insertFile = await projectService.createNewFileToProject({
      description: `Let's add description`,
      url: dataUpload.Location,
      nameFile: req.files[i].originalname,
      uniqueNameFile: req.files[i].filename,
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

const getSortProject = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ status: true, data: SORT_PROJECT });
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
  openFileOfProject,
  getSortProject,
};
