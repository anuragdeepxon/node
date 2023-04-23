const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const {
  getOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/order');
const router = express.Router();

// Get all orders for a user
router.get('/', authMiddleware, getOrders);

// Create a new order for a user
router.post('/', authMiddleware, createOrder);

// Get a specific order by id
router.get('/:id', authMiddleware, getOrder);

// Update an order by id
router.put('/:id', authMiddleware, updateOrder);

// Delete an order by id
router.delete('/:id', authMiddleware, deleteOrder);

module.exports = router;
