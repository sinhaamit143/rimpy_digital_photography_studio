const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Customer Review Management
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all active testimonials
 *     tags: [Testimonials]
 *   post:
 *     summary: Create new testimonial (Admin Only)
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', testimonialController.getAllTestimonials);
router.post('/', authMiddleware, upload.single('image'), testimonialController.createTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authMiddleware, upload.single('image'), testimonialController.updateTestimonial);
router.delete('/:id', authMiddleware, testimonialController.deleteTestimonial);

module.exports = router;
