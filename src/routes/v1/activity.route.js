const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const activitiyValidation = require('../../validations/activity.validation');
const activitiyController = require('../../controllers/activity.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(''), validate(activitiyValidation.createActivity), activitiyController.createActivity)
  .get(auth(''), validate(activitiyValidation.getActivities), activitiyController.getActivities);

router
  .route('/objectid/:activitiyId')
  .get(auth(''), validate(activitiyValidation.getActivity), activitiyController.getActivity)
  .patch(auth(''), validate(activitiyValidation.updateActivity), activitiyController.updateActivity)
  .delete(auth(''), validate(activitiyValidation.deleteActivity), activitiyController.deleteActivity);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: activities
 *   description: activity management and retrieval
 */

/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Create a activity
 *     description: User can add activity to use.
 *     tags: [activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - userId
 *               - action
 *               - projectId
 *             properties:
 *               comment:
 *                 type: string
 *               userId:
 *                 type: string
 *               action:
 *                 type: string
 *               projectId:
 *                 type: string
 *             example:
 *               comment: I change somethings
 *               userId: 5ebac534954b54139806c112
 *               action: create_project
 *               projectId: 5ebac534954b54139806c112
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/activity'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all activities
 *     description: Only admins can retrieve all activities.
 *     tags: [activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: activity name
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
 *         description: Maximum number of activities
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
 *                     $ref: '#/components/schemas/activity'
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
 * /activities/objectid/{activitiy_id}:
 *   get:
 *     summary: Get a activity
 *     description: Logged in user can fetch only their own activity information. Only admins can fetch other activities.
 *     tags: [activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: activity id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/activity'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a activity
 *     description: Logged in user can only update their own information. Only admins can update other activities.
 *     tags: [activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: activity id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *               userId:
 *                 type: string
 *               action:
 *                 type: string
 *               projectId:
 *                 type: string
 *             example:
 *               comment: I change somethings
 *               userId: 5ebac534954b54139806c112
 *               action: create_project
 *               projectId: 5ebac534954b54139806c112
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/activity'
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
 *     summary: Delete a activity
 *     description: Logged in user can delete only themselves. Only admins can delete other activities.
 *     tags: [activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: activity id
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
 * /activities/codeactivitiy/{activitiy_code}:
 *   get:
 *     summary: Get all activity with activity code
 *     description: get all activity by activity code
 *     tags: [activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: activity id
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
