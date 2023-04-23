const express = require('express');
const router = express.Router();
const { addItemToCart, removeItemFromCart, updateCartItemQuantity, getCartItems } = require('../controllers/cart');
const { checkout } = require('../controllers/checkout');
const { authMiddleware } = require('../middlewares/auth');

// Cart management routes
router.post('/cart/add', authMiddleware, addItemToCart);
router.post('/cart/remove', authMiddleware, removeItemFromCart);
router.put('/cart/update', authMiddleware, updateCartItemQuantity);
router.get('/cart/:userId', authMiddleware, getCartItems);

// Checkout route
router.post('/checkout', authMiddleware, checkout);

module.exports = router;
