const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const projectValidation = require('../../validations/project.validation');
const projectController = require('../../controllers/project.controller');
const { authJwt } = require('../../middlewares/jwtAuth');
const upload = require('../../middlewares/multer');

const router = express.Router();

router
  .route('/')
  .post(authJwt(), validate(projectValidation.createProject), projectController.createProject)
  .get(authJwt(), validate(projectValidation.getProjects), projectController.getProjects);
router.post('/upload-file', authJwt(), upload.array('files', 5), projectController.uploadFileToProject);
router.get('/sort', projectController.getSortProject);
router.route('/detail/:slug').get(authJwt(''), validate(projectValidation.getProject), projectController.getDetailProject);
router.post(
  '/open-file-of-project',
  validate(projectValidation.openFileOfProject),
  authJwt(''),
  projectController.openFileOfProject
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: projects
 *   description: project management and retrieval
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a project
 *     description: User can add project to use.
 *     tags: [projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_name
 *               - word
 *               - source_language
 *               - target_language
 *             properties:
 *               project_name:
 *                type: string
 *               user_id:
 *                 type: string
 *               source_language:
 *                 type: string
 *               target_language:
 *                 type: string
 *             example:
 *               project_name: test
 *               user_id: 5ebac534954b54139806c112
 *               source_language: english
 *               target_language: vietnamese
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/project'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all projects
 *     description: Only admins can retrieve all projects.
 *     tags: [projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: project name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of projects
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/project'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /projects/objectid/{project_id}:
 *   get:
 *     summary: Get a project
 *     description: Logged in user can fetch only their own project information. Only admins can fetch other projects.
 *     tags: [projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: project id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/project'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a project
 *     description: Logged in user can only update their own information. Only admins can update other projects.
 *     tags: [projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: project id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project_name:
 *                type: string
 *               user_id:
 *                 type: string
 *               source_language:
 *                 type: string
 *               target_language:
 *                 type: string
 *             example:
 *               project_name: test
 *               user_id: 5ebac534954b54139806c112
 *               source_language: english
 *               target_language: vietnamese
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/project'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a project
 *     description: Logged in user can delete only themselves. Only admins can delete other projects.
 *     tags: [projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: project id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /project/userid/{user_id}:
 *   get:
 *     summary: Get all translate with user id
 *     description: get all translation by user id
 *     tags: [projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: user id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/translate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
