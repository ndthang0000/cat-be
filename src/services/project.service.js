const httpStatus = require('http-status');
const { Project, User, File } = require('../models');
const ApiError = require('../utils/ApiError');
const generateImage = require('../utils/generate.image');
const config = require('../config/config');
const { uploadFile } = require('../utils/upload.file');
const publicURL = require('../../get_url');
const { PROJECT_ROLE } = require('../constants/status');

/**
 * Create a project
 * @param {Object} projectBody
 * @returns {Promise<Project>}
 */
const createProject = async (projectBody) => {
  const data = await new Project(projectBody).save();
  await generateImage(projectBody.projectName, data.slug);
  const dataUpload = await uploadFile(`${publicURL}/generate-image/${data.slug}.png`, `${data.slug}.png`);
  data.image = dataUpload.Location;
  await data.save();
  return data;
};

/**
 * Query for projects
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProjects = async (filters, options) => {
  const filtersAgg = [
    {
      $match: filters,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'userId',
        as: 'owner',
      },
    },
    {
      $unwind: '$owner',
    },
  ];

  const projects = await Project.paginateAgg(filtersAgg, options);
  return projects;
};

const getDetailProject = async (slug) => {
  const projects = await Project.findOne(slug).populate('files');
  if (!projects) {
    return {
      status: false,
      message: `Don't find exit project`,
    };
  }
  const owner = await User.findOne({ userId: projects.userId });
  return {
    status: true,
    data: {
      projects,
      owner,
      // sentences
    },
  };
};
/**
 * Get word trans by pj id
 * @param {string} userID
 * @returns {Promise<Project>}
 */
const getProjectByUserID = async (userID) => {
  return Project.find({ user_id: userID });
};

/**
 * Get project by ID
 * @param {ObjectId} ID
 * @returns {Promise<Project>}
 */
const getProjectById = async (ID) => {
  return Project.findById(ID);
};

/**
 * Update project by ID
 * @param {ObjectId} projectID
 * @param {Object} updateBody
 * @returns {Promise<project>}
 */
const updateProjectById = async (projectID, updateBody) => {
  const project = await getProjectById(projectID);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'project not found');
  }
  Object.assign(project, updateBody);
  await project.save();
  return project;
};

/**
 * Delete project by ID
 * @param {ObjectId} projectID
 * @returns {Promise<Project>}
 */
const deleteProjectById = async (projectID) => {
  const project = await getProjectById(projectID);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'project not found');
  }
  await project.remove();
  return project;
};

const createNewFileToProject = async (body) => {
  return File.create(body);
};

module.exports = {
  createProject,
  queryProjects,
  getProjectByUserID,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getDetailProject,
  createNewFileToProject,
};
