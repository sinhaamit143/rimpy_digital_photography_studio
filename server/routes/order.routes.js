import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public route for submitting inquiries/orders
router.post('/', createOrder);

// Protected routes for admin management
router.get('/', verifyToken, getOrders);
router.patch('/:id/status', verifyToken, updateOrderStatus);

export default router;
