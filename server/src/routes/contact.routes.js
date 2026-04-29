const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Inquiry and Lead Management
 */

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Get all inquiries (Admin Only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Submit a new inquiry
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 */
router.post('/', contactController.submitInquiry);
router.get('/', authMiddleware, contactController.getAllInquiries);

/**
 * @swagger
 * /api/contact/{id}/read:
 *   patch:
 *     summary: Mark inquiry as read
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/read', authMiddleware, contactController.toggleReadStatus);

/**
 * @swagger
 * /api/contact/{id}:
 *   delete:
 *     summary: Delete inquiry
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authMiddleware, contactController.deleteInquiry);

module.exports = router;
