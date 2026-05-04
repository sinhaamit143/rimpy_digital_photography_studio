const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const portfolioRoutes = require('./portfolio.routes');
const contactRoutes = require('./contact.routes');
const testimonialRoutes = require('./testimonial.routes');
const settingsRoutes = require('./settings.routes');
const orderRoutes = require('./order.routes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/settings', settingsRoutes);
router.use('/orders', orderRoutes);

console.log('✅ API Routes initialized: /auth, /products, /portfolio, /contact, /testimonials, /settings, /orders');

module.exports = router;
