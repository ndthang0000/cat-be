const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService, memberService, userService, activityService } = require('../services');
const { PROJECT_ROLE } = require('../constants/status');
const { uploadFile } = require('../utils/upload.file');
const { sentenceTokenizeFromFileDocx } = require('../python');
const { readFileWord } = require('../readfile/readfileWord');
const logger = require('../config/logger');
const { SORT_PROJECT } = require('../constants/sort');
const LANGUAGE = require('../constants/language');
const ObjectId = require('mongoose').Types.ObjectId;
const { tokenizeSentence } = require('../utils/sentence.tokenize');
const ACTIVITY = require('../constants/activity');
const { default: axios } = require('axios');
const config = require('../config/config');
const LanguageDetect = require('languagedetect');
const DocxFile = require('../utils/DocxFile');
const XlsxFile = require('../utils/XlsxFile');

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
  // const createJoinMember = await memberService.createNewMember({
  //   role: PROJECT_ROLE.OWNER,
  //   userId: req.user._id
  // })
  // project.allMember.push(createJoinMember?._id)
  // await project.save()
  const activityCreateProject = {
    comment: `[${req.user.email}] create this project`,
    userId: req.user._id,
    action: ACTIVITY.CREATE_PROJECT,
    projectId: project._id,
  };
  await activityService.createActivity(activityCreateProject);
  res
    .status(httpStatus.CREATED)
    .send({ data: project, status: true, message: `Congratulation, Create Project ${project.projectName} successfully!!` });
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
  const { slug, fileId } = req.body;
  const options = pick(req.query, ['limit', 'page']);
  const filter = pick(req.query, ['status']);
  const { _id } = req.user;
  const findProject = await projectService.getProjectBySlug(slug);
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
    const splitName = findFile.nameFile.split('.');
    const dotFile = splitName[splitName.length - 1];
    try {
      let file = '';
      if (dotFile == 'docx') {
        file = new DocxFile(`uploads/${findFile.uniqueNameFile}`);
      } else if (dotFile == 'xlsx') {
        file = new XlsxFile(`uploads/${findFile.uniqueNameFile}`);
      }
      const dataSentence = file.getSentences();
      const dataInsertDB = dataSentence.map((item, index) => {
        return {
          projectId: findProject._id,
          fileId,
          textSrc: item,
          index: index + 1,
        };
      });
      const results = await projectService.createManySentenceOfFileOfProject(dataInsertDB);
      findFile.isTokenizeSentence = true;
      findFile.quantitySentence = dataSentence.length;
      await findFile.save();
      const dataPaginate = await projectService.getPaginateSentenceOfFile(
        { projectId: findProject._id, fileId, ...filter },
        options
      );
      return res.status(200).json({ status: true, data: dataPaginate, project: findProject });
    } catch (error) {
      logger.error(`ERR Tokenize or Readfile ${error.message}: fileId: ${findFile._id}`);
      return res.send({ status: false, message: 'Something went wrong with this file' });
    }
  }
  const data = await projectService.getPaginateSentenceOfFile({ projectId: findProject._id, fileId, ...filter }, options);
  res.send({ status: true, data, project: findProject });
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
    console.log(req.files[i]);
    const dataUpload = await uploadFile(req.files[i].path, 'files/' + req.files[i].filename);
    const insertFile = await projectService.createNewFileToProject({
      description: `Let's add description`,
      url: dataUpload.Location,
      nameFile: req.files[i].originalname,
      uniqueNameFile: req.files[i].filename,
    });
    findProject.files.push(insertFile._id);
    const activityUploadFile = {
      comment: `[${req.user.email}] upload file: ${req.files[i].originalname}`,
      userId: _id,
      action: ACTIVITY.UPLOAD_FILE,
      projectId: findProject._id,
    };
    await activityService.createActivity(activityUploadFile);
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
  const { _id } = req.body;
  const project = await projectService.getProjectById(_id);
  if (!project) {
    return res.status(200).json({ status: false, message: `Not found project, please contact support` });
  }
  delete req.body._id;
  Object.assign(project, req.body);
  await project.save();
  const activityUpdateProject = {
    comment: `[${req.user.email}] update this project`,
    userId: req.user._id,
    action: ACTIVITY.UPDATE_PROJECT,
    projectId: project._id,
  };
  await activityService.createActivity(activityUpdateProject);
  return res
    .status(200)
    .json({ status: true, data: project, message: `Update Information for project <${project.projectName}> successfully` });
});

const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProjectById(req.params.projectId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getSortProject = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ status: true, data: SORT_PROJECT });
});

const getRoleOfProject = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ status: true, data: Object.values(PROJECT_ROLE) });
});

const getAllLanguageOfSystem = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send({ status: true, data: Object.values(LANGUAGE) });
});

const addMemberToProject = catchAsync(async (req, res) => {
  const { email, projectId, role } = req.body;
  const { _id } = req.user;

  const findUser = await userService.getUserByEmail(email);
  if (!findUser) {
    return res.status(200).json({ status: false, message: `User [${email}] not exit in system` });
  }

  const findProject = await projectService.getProjectById(projectId);
  if (!findProject) {
    return res.status(200).json({ status: false, message: `Project invalid` });
  }
  const checkPermission = projectService.checkPermissionOfUser(findProject, _id, PROJECT_ROLE.PROJECT_MANAGER);
  if (!checkPermission.status) {
    return res.send(checkPermission);
  }
  if (findProject.members.find((member) => member.userId == findUser.id)) {
    return res.status(200).json({ status: false, message: 'This member already exists' });
  }

  findProject.members.push({
    userId: findUser._id,
    role,
  });
  await findProject.save();

  const activityAddMember = {
    comment: `[${req.user.email}] add [${email}] with role ${role} into this project`,
    userId: _id,
    action: ACTIVITY.ADD_MEMBER,
    projectId: projectId,
  };

  await activityService.createActivity(activityAddMember);

  res.status(httpStatus.OK).send({
    status: true,
    data: Object.values(PROJECT_ROLE),
    message: `Add [${email}] with role ${role} into this project successfully !!`,
  });
});

const removeMemberFromProject = catchAsync(async (req, res) => {
  const { id, projectId } = req.body;

  const findProject = await projectService.getProjectById(projectId);
  if (!findProject) {
    return res.status(200).json({ status: false, message: `Project invalid` });
  }

  const { _id } = req.user;
  const checkPermission = projectService.checkPermissionOfUser(findProject, _id, PROJECT_ROLE.PROJECT_MANAGER);
  if (!checkPermission.status) {
    return res.send(checkPermission);
  }

  // const findMember = await projectService.getMemberById(id);
  const findMember = findProject.members.find((member) => member._id == id);
  if (!findMember) {
    return res.status(200).json({ status: false, message: 'This ID does not belong to any member' });
  }

  const findExistUser = await userService.getUserById(findMember.userId);
  if (!findExistUser) {
    return res.status(200).json({ status: false, message: `Not found user in system` });
  }

  findProject.members = findProject.members.filter((member) => member._id != id);
  await findProject.save();

  const activityAddMember = {
    comment: `[${req.user.email}] kick out user [${findExistUser.email}]`,
    userId: _id,
    action: ACTIVITY.REMOVE_MEMBER,
    projectId,
  };

  await activityService.createActivity(activityAddMember);

  res.status(httpStatus.OK).send({
    status: true,
    message: `Remove userId [${findExistUser.email}] successfully !!`,
    data: Object.values(PROJECT_ROLE),
  });
});

const exportFile = catchAsync(async (req, res) => {
  const { fileId, projectId } = req.body;
  const { _id } = req.user;

  const findProject = await projectService.getProjectById(projectId);
  if (!findProject) {
    return res.status(200).json({ status: false, message: `Project invalid` });
  }

  const checkPermission = projectService.checkPermissionOfUser(findProject, _id, PROJECT_ROLE.PROJECT_MANAGER);
  if (!checkPermission.status) {
    return res.send(checkPermission);
  }

  const findFile = await projectService.getOneFileOfProjectById(fileId);
  if (!findFile) {
    return res.status(200).json({ status: false, message: `File not found` });
  }

  const allSentence = await projectService.filterSentence({ fileId });

  try {
    const translated_sents = allSentence.map((item) => item.textTarget);

    const splitName = findFile.nameFile.split('.');
    const dotFile = splitName[splitName.length - 1];

    let file = '';
    if (dotFile == 'docx') file = new DocxFile(`uploads/${findFile.uniqueNameFile}`);
    else if (dotFile == 'xlsx') file = new XlsxFile(`uploads/${findFile.uniqueNameFile}`);
    file.exportFile(translated_sents, `uploads/${findFile.uniqueNameFile}`);

    const dataUpload = await uploadFile(`uploads/${findFile.uniqueNameFile}`, 'files/' + findFile.nameFile);
    if (dataUpload.Location) {
      findFile.urlTarget = dataUpload.Location;
      await findFile.save();

      res.status(httpStatus.OK).send({ status: true, data: dataUpload.Location });
    } else {
      res.status(httpStatus.OK).send({ status: false, message: 'Something went wrong !!!, please contact support' });
    }
  } catch (error) {
    res.status(httpStatus.OK).send({
      status: false,
      message: 'Something went wrong !!!, please contact support',
    });
  }
});

const detectLanguage = catchAsync(async (req, res) => {
  const { text } = req.body;
  const data = await axios.post(`${config.domain.pythonDomain}/detect-language`, { sentence: text });
  res.status(200).json(data.data);
});

const createNewTermBase = catchAsync(async (req, res) => {
  const { projectId, src, target } = req.body;
  const { _id } = req.user;
  const findProject = await projectService.getProjectById(projectId);
  if (!findProject) {
    return res.status(200).json({ status: false, message: `Project invalid` });
  }
  const checkPermission = projectService.checkPermissionOfUser(findProject, _id, PROJECT_ROLE.GUEST);
  if (!checkPermission.status) {
    return res.send(checkPermission);
  }
  const data = await projectService.createNewTermBase({
    projectId,
    textSrc: src,
    textTarget: target,
    userId: _id,
    language: `${findProject.sourceLanguage}-${findProject.targetLanguage}`,
    dictionaryCode: findProject.dictionaryCode,
  });

  const tmBody = {
    source: data.textSrc,
    target: data.textTarget,
    dictionaryCode: data.dictionaryCode,
    id: data._id,
  };
  try {
    const dataPostElastic = await axios.put(`http://localhost:9200/term-base/_doc/${tmBody.id}`, tmBody, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(dataPostElastic);
  } catch (err) {
    console.log(err.message);
  }

  res.status(200).json({ status: true, message: `Create Term Base [${data.textSrc}-${data.textTarget}]` });
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
  getRoleOfProject,
  addMemberToProject,
  removeMemberFromProject,
  getAllLanguageOfSystem,
  exportFile,
  detectLanguage,
  createNewTermBase,
};
