const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

/**
 * @swagger
 * tags:
 *   name: Portfolio
 *   description: Photography Gallery and Album Management
 */

/**
 * @swagger
 * /api/portfolio/albums:
 *   get:
 *     summary: Get all albums
 *     tags: [Portfolio]
 *   post:
 *     summary: Create new album (Admin Only)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.get('/albums', portfolioController.getAllAlbums);
router.post('/albums', authMiddleware, upload.single('image'), portfolioController.createAlbum);

/**
 * @swagger
 * /api/portfolio/albums/{id}:
 *   get:
 *     summary: Get album details and images
 *     tags: [Portfolio]
 *   delete:
 *     summary: Delete album
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.get('/albums/:id', portfolioController.getAlbumById);
router.put('/albums/:id', authMiddleware, upload.single('image'), portfolioController.updateAlbum);
router.delete('/albums/:id', authMiddleware, portfolioController.deleteAlbum);

/**
 * @swagger
 * /api/portfolio/images/{id}:
 *   delete:
 *     summary: Delete specific image from album
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/images/:id', authMiddleware, portfolioController.deleteImage);

/**
 * @swagger
 * /api/portfolio/albums/{albumId}/images:
 *   post:
 *     summary: Add multiple images to album (Admin Only)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.post('/albums/:albumId/images', authMiddleware, upload.array('images', 20), portfolioController.addImagesToAlbum);

/**
 * @swagger
 * /api/portfolio/categories:
 *   get:
 *     summary: Get all portfolio categories
 *     tags: [Portfolio]
 *   post:
 *     summary: Create new portfolio category
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 */
router.get('/categories', portfolioController.getCategories);
router.post('/categories', authMiddleware, portfolioController.createCategory);
router.delete('/categories/:id', authMiddleware, portfolioController.deleteCategory);

module.exports = router;
