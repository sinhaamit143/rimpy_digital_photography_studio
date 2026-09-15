const express = require('express');
const router = express.Router();
const googleReviewsController = require('../controllers/googleReviews.controller');

/**
 * @swagger
 * tags:
 *   name: External
 *   description: External Integrations
 */

/**
 * @swagger
 * /api/google-reviews:
 *   get:
 *     summary: Get live Google Reviews
 *     tags: [External]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', googleReviewsController.getGoogleReviews);

module.exports = router;
