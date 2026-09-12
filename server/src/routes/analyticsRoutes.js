const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/auth.middleware');

// Protect the analytics routes – only admin can access
router.get('/', authMiddleware, analyticsController.getAnalytics);

// New analytics endpoints
router.get('/device', authMiddleware, analyticsController.getDeviceBreakdown);
router.get('/top-pages', authMiddleware, analyticsController.getTopPages);
router.get('/traffic-sources', authMiddleware, analyticsController.getTrafficSources);
router.get('/age-distribution', authMiddleware, analyticsController.getAgeDistribution);
router.get('/country-distribution', authMiddleware, analyticsController.getCountryDistribution);
router.get('/state-distribution', authMiddleware, analyticsController.getStateDistribution);

module.exports = router;
