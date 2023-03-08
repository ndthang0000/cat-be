const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const DictionaryValidation = require('../../validations/dictionary.validation');
const DictionaryController = require('../../controllers/dictionary.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageDictionaries'), validate(DictionaryValidation.createDictionary), DictionaryController.createDictionary)
  .get(auth('getDictionaries'), validate(DictionaryValidation.getDictionaries), DictionaryController.getDictionaries);

router
  .route('/:DictionaryId')
  .get(auth('getDictionaries'), validate(DictionaryValidation.getDictionary), DictionaryController.getDictionary)
  .patch(auth('manageDictionaries'), validate(DictionaryValidation.updateDictionary), DictionaryController.updateDictionary)
  .delete(auth('manageDictionaries'), validate(DictionaryValidation.deleteDictionary), DictionaryController.deleteDictionary);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Dictionaries
 *   description: Dictionary management and retrieval
 */

/**
 * @swagger
 * /Dictionaries:
 *   post:
 *     summary: Create a Dictionary
 *     description: User can add dictionary to use.
 *     tags: [Dictionaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - word
 *               - wordtype
 *               - mean
 *             properties:
 *               user_id:
 *                 type: string
 *               word:
 *                 type: string
 *               wordtype:
 *                 type: string
 *               mean:
 *                 type: string
 *             example:
 *               user_id: 5ebac534954b54139806c112
 *               word: dog
 *               wordtype: /n/
 *               mean: chó
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Dictionary'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all Dictionaries
 *     description: Only admins can retrieve all Dictionaries.
 *     tags: [Dictionaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Dictionary name
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
 *         description: Maximum number of Dictionaries
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
 *                     $ref: '#/components/schemas/Dictionary'
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
 * /Dictionaries/{id}:
 *   get:
 *     summary: Get a Dictionary
 *     description: Logged in user can fetch only their own Dictionary information. Only admins can fetch other Dictionaries.
 *     tags: [Dictionaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dictionary id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Dictionary'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a Dictionary
 *     description: Logged in user can only update their own information. Only admins can update other Dictionaries.
 *     tags: [Dictionaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dictionary id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type:string
 *               word:
 *                 type: string
 *               wordtype:
 *                 type: string
 *               mean:
 *                 type: string
 *             example:
 *                 user_id: 5ebac534954b54139806c112
 *                 word: dog
 *                 wordtype: /n/
 *                 mean: chó
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Dictionary'
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
 *     summary: Delete a Dictionary
 *     description: Logged in user can delete only themselves. Only admins can delete other Dictionaries.
 *     tags: [Dictionaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dictionary id
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
