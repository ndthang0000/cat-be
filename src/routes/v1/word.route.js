const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const wordValidation = require('../../validations/word.validation');
const wordController = require('../../controllers/word.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(''), validate(wordValidation.createWord), wordController.createWord)
  .get(auth(''), validate(wordValidation.getWords), wordController.getWords);

router
  .route('/:wordId')
  .get(auth(''), validate(wordValidation.getWord), wordController.getWord)
  .patch(auth(''), validate(wordValidation.updateWord), wordController.updateWord)
  .delete(auth(''), validate(wordValidation.deleteWord), wordController.deleteWord);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: words
 *   description: word management and retrieval
 */

/**
 * @swagger
 * /word:
 *   post:
 *     summary: Create a word
 *     description: User can add word to use.
 *     tags: [words]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dictionary_id
 *               - word
 *               - mean
 *             properties:
 *               dictionary_id:
 *                 type: string
 *               word:
 *                 type: string
 *               mean:
 *                 type: string
 *             example:
 *               dictionary_id: 5ebac534954b54139806c112
 *               word: dog
 *               mean: chó
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/word'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all words
 *     tags: [words]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: word name
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
 *         description: Maximum number of words
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
 *                     $ref: '#/components/schemas/word'
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
 * /word/{id}:
 *   get:
 *     summary: Get a word
 *     description: Logged in user can fetch only their own word information. Only admins can fetch other words.
 *     tags: [words]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: word id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/word'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a word
 *     description: Logged in user can only update their own information. Only admins can update other words.
 *     tags: [words]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: word id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dictionary_id:
 *                 type:string
 *               word:
 *                 type: string
 *               mean:
 *                 type: string
 *             example:
 *                 dictionary_id: 5ebac534954b54139806c112
 *                 word: dog
 *                 mean: chó
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/word'
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
 *     summary: Delete a word
 *     description: Logged in user can delete only themselves. Only admins can delete other words.
 *     tags: [words]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: word id
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
