const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const dictionaryValidation = require('../../validations/dictionary.validation');
const dictionaryController = require('../../controllers/dictionary.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(''), validate(dictionaryValidation.createDictionary), dictionaryController.createDictionary)
  .get(auth(''), validate(dictionaryValidation.getDictionaries), dictionaryController.getDictionaries);

router
  .route('/:DictionaryId')
  .get(auth(''), validate(dictionaryValidation.getDictionary), dictionaryController.getDictionary)
  .patch(auth(''), validate(dictionaryValidation.updateDictionary), dictionaryController.updateDictionary)
  .delete(auth(''), validate(dictionaryValidation.deleteDictionary), dictionaryController.deleteDictionary);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: dictionaries
 *   description: dictionary management and retrieval
 */

/**
 * @swagger
 * /dictionaries:
 *   post:
 *     summary: Create a dictionary
 *     description: User can add dictionary to use.
 *     tags: [dictionaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dictionary_name
 *               - dictionary_code
 *               - source_language
 *               - target_language
 *             properties:
 *               dictionary_name:
 *                 type: string
 *               dictionary_code:
 *                 type: string
 *               source_language:
 *                 type: string
 *               target_language:
 *                 type: string
 *             example:
 *               dictionary_name: english_to_vietnamese
 *               dictionary_code: 5ebac534954b54139806c112
 *               source_language: english
 *               target_language: vietnamese
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/dictionary'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all dictionaries
 *     description: Only admins can retrieve all dictionaries.
 *     tags: [dictionaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: dictionary name
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
 *         description: Maximum number of dictionaries
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
 *                     $ref: '#/components/schemas/dictionary'
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
 * /dictionaries/{id}:
 *   get:
 *     summary: Get a dictionary
 *     description: Logged in user can fetch only their own dictionary information. Only admins can fetch other dictionaries.
 *     tags: [dictionaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: dictionary id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/dictionary'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a dictionary
 *     description: Logged in user can only update their own information. Only admins can update other dictionaries.
 *     tags: [dictionaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: dictionary id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dictionary_name:
 *                 type: string
 *               dictionary_code:
 *                 type: string
 *               source_language:
 *                 type: string
 *               target_language:
 *                 type: string
 *             example:
 *               dictionary_name: english_to_vietnamese
 *               dictionary_code: 5ebac534954b54139806c112
 *               source_language: english
 *               target_language: vietnamese
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/dictionary'
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
 *     summary: Delete a dictionary
 *     description: Logged in user can delete only themselves. Only admins can delete other dictionaries.
 *     tags: [dictionaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: dictionary id
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
