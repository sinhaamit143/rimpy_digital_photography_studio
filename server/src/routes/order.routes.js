const express = require('express');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', createOrder);
router.get('/', authMiddleware, getOrders);
router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
