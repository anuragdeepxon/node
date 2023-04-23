const express = require('express');
const { Order } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all orders for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { userId: req.user.userId } });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
});

// Create a new order for a user
router.post('/', authMiddleware, async (req, res) => {
    try {
        const order = await Order.create({
            userId: req.user.userId,
            restaurantId: req.body.restaurantId,
        });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
});

// Get a specific order by id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { id: req.params.id, userId: req.user.userId },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching order', error: err.message });
    }
});

// Update an order by id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const [updatedRowCount] = await Order.update(
            {
                restaurantId: req.body.restaurantId,
            },
            {
                where: { id: req.params.id, userId: req.user.userId },
            }
        );

        if (updatedRowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating order', error: err.message });
    }
});

// Delete an order by id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedRowCount = await Order.destroy({
            where: { id: req.params.id, userId: req.user.userId },
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting order', error: err.message });
    }
});

// ... Add other CRUD operations for orders as needed

module.exports = router;