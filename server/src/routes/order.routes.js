const express = require('express');
const { createOrder, getOrders, updateOrderStatus, deleteOrder } = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { formLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

router.post('/', formLimiter, createOrder);
router.get('/', authMiddleware, getOrders);
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, deleteOrder);

module.exports = router;
