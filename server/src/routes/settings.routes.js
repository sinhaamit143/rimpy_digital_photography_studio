const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Studio configuration and metadata
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get studio settings (Public)
 *     tags: [Settings]
 */
router.get('/', settingsController.getSettings);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update studio settings (Admin Only)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 */
router.put('/', authMiddleware, settingsController.updateSettings);

module.exports = router;
