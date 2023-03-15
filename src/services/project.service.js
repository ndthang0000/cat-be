const httpStatus = require('http-status');
const { project } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a project
 * @param {Object} projectBody
 * @returns {Promise<project>}
 */
const createProject = async (projectBody) => {
    return project.create(projectBody);
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
  const queryProjects = async (filter, options) => {
    const projects = await project.paginate(filter, options);
    return projects;
  };

//   /**
//    * Get project by name
//    * @param {string} name
//    * @returns {Promise<project>}
//    */
//   const getprojectByName = async (name) => {
//     return project.findOne({ name });
//   };
  
    /**
   * Get project by ID
   * @param {ObjectId} ID
   * @returns {Promise<project>}
   */
    const getProjectById = async (ID) => {
      return project.findById(ID);
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
   * @returns {Promise<project>}
   */
  const deleteProjectById = async (projectID) => {
    const project = await getProjectById(projectID);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'project not found');
    }
    await project.remove();
    return project;
  };
  
  module.exports = {
    createProject,
    queryProjects,
    // getProjectByWord,
    getProjectById,
    updateProjectById,
    deleteProjectById,
  };