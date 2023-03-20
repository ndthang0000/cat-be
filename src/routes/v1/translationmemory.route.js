const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const TranslationMemoryValidation = require('../../validations/translationmemory.validation');
const TranslationMemoryController = require('../../controllers/translationmemory.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth(''),
    validate(TranslationMemoryValidation.createTranslationMemory),
    TranslationMemoryController.createTranslationMemory
  )
  .get(
    auth(''),
    validate(TranslationMemoryValidation.getTranslationMemories),
    TranslationMemoryController.getTranslationMemories
  );

router
  .route('/objectid/:TranslationMemoryId')
  .get(
    auth(''),
    validate(TranslationMemoryValidation.getTranslationMemory),
    TranslationMemoryController.getTranslationMemory
  )
  .patch(
    auth(''),
    validate(TranslationMemoryValidation.updateTranslationMemory),
    TranslationMemoryController.updateTranslationMemory
  )
  .delete(
    auth(''),
    validate(TranslationMemoryValidation.deleteTranslationMemory),
    TranslationMemoryController.deleteTranslationMemory
  );

  router
  .route('/codetranslationmemory/:codeTrans')
  .get(
    auth(''),
    validate(TranslationMemoryValidation.getTranslationMemories),
    TranslationMemoryController.getTranslationMemoryByCode
  )

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: TranslationMemories
 *   description: TranslationMemory management and retrieval
 */

/**
 * @swagger
 * /TranslationMemories:
 *   post:
 *     summary: Create a TranslationMemory
 *     description: User can add translationmemory to use.
 *     tags: [TranslationMemories]
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
 *               - translate
 *             properties:
 *               user_id:
 *                 type: string
 *               word:
 *                 type: string
 *               translate:
 *                 type: string
 *             example:
 *               user_id: 5ebac534954b54139806c112
 *               word: A dog
 *               translate: Một con chó
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TranslationMemory'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all TranslationMemories
 *     description: Only admins can retrieve all TranslationMemories.
 *     tags: [TranslationMemories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: TranslationMemory name
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
 *         description: Maximum number of TranslationMemories
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
 *                     $ref: '#/components/schemas/TranslationMemory'
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
 * /TranslationMemories/objectid/{translationmemory_id}:
 *   get:
 *     summary: Get a TranslationMemory
 *     description: Logged in user can fetch only their own TranslationMemory information. Only admins can fetch other TranslationMemories.
 *     tags: [TranslationMemories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: TranslationMemory id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TranslationMemory'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a TranslationMemory
 *     description: Logged in user can only update their own information. Only admins can update other TranslationMemories.
 *     tags: [TranslationMemories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: TranslationMemory id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               word:
 *                 type: string
 *               translate:
 *                 type: string
 *             example:
 *                 user_id: 5ebac534954b54139806c112
 *                 word: A dog
 *                 translate: Một con chó
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TranslationMemory'
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
 *     summary: Delete a TranslationMemory
 *     description: Logged in user can delete only themselves. Only admins can delete other TranslationMemories.
 *     tags: [TranslationMemories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: TranslationMemory id
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
 * /TranslationMemories/codetranslationmemory/{translationmemory_code}:
 *   get:
 *     summary: Get all translationmemory with translationmemory code
 *     description: get all translationmemory by translationmemory code
 *     tags: [TranslationMemories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: translationmemory id
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