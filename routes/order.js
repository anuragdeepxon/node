const express = require('express');
const { getAllOrders, createOrder, getOrderById, updateOrder, deleteOrder } = require('../controllers/order');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, getAllOrders);
router.post('/', authMiddleware, createOrder);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id', authMiddleware, updateOrder);
router.delete('/:id', authMiddleware, deleteOrder);

module.exports = router;
