const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const translateValidation = require('../../validations/translate.validation');
const translateController = require('../../controllers/translate.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(''), validate(translateValidation.createWordTrans), translateController.createWordTrans)
  .get(auth(''), validate(translateValidation.getWordsTrans), translateController.getWordsTrans);

router
  .route('/objectid/:wordId')
  .get(auth(''), validate(translateValidation.getWordTrans), translateController.getWordTrans)
  .patch(auth(''), validate(translateValidation.updateWordTrans), translateController.updateWordTrans)
  .delete(auth(''), validate(translateValidation.deleteWordTrans), translateController.deleteWordTrans);

router
  .route('/projectid/:projectId')
  .get(auth(''), validate(translateValidation.getWordsTrans), translateController.getWordsTransByProjectID)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: translate
 *   description: translate management and retrieval
 */

/**
 * @swagger
 * /translate:
 *   post:
 *     summary: Create a translate
 *     description: User can add translate to use.
 *     tags: [translate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_id
 *               - source
 *               - target
 *             properties:
 *               project_id:
 *                 type: string
 *               source:
 *                 type: string
 *               target:
 *                 type: string
 *             example:
 *               project_id: 5ebac534954b54139806c112
 *               source: dog
 *               target: chó
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/translate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all translate
 *     tags: [translate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: translate name
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
 *         description: Maximum number of translate
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
 *                     $ref: '#/components/schemas/translate'
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
 * /translate/objectid/{word_id}:
 *   get:
 *     summary: Get a translate
 *     description: Logged in user can fetch only their own translate information. Only admins can fetch other translate.
 *     tags: [translate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: translate id
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
 *
 *   patch:
 *     summary: Update a translate
 *     description: Logged in user can only update their own information. Only admins can update other translate.
 *     tags: [translate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: translate id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *               source:
 *                 type: string
 *               target:
 *                 type: string
 *             example:
 *               project_id: 5ebac534954b54139806c112
 *               source: dog
 *               target: chó
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/translate'
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
 *     summary: Delete a translate
 *     description: Logged in user can delete only themselves. Only admins can delete other translate.
 *     tags: [translate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: translate id
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
 * /translate/projectid/{project_id}:
 *   get:
 *     summary: Get all translate with project id
 *     description: get all translation by project id
 *     tags: [translate]
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
 *                $ref: '#/components/schemas/translate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
