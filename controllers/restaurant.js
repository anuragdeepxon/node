const express = require('express');
const { Restaurant } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll();
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching restaurants', error: err.message });
    }
});

// Create a new restaurant
router.post('/', [authMiddleware, roleMiddleware(['admin'])], async (req, res) => {
    try {
        const restaurant = await Restaurant.create({
            name: req.body.name,
            location: req.body.location,
        });
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(500).json({ message: 'Error creating restaurant', error: err.message });
    }
});

// Get a specific restaurant by id
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findByPk(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching restaurant', error: err.message });
    }
});

// Update a restaurant by id
router.put('/:id', [authMiddleware, roleMiddleware(['admin'])], async (req, res) => {
    try {
        const [updatedRowCount] = await Restaurant.update(
            {
                name: req.body.name,
                location: req.body.location,
            },
            {
                where: { id: req.params.id },
            }
        );

        if (updatedRowCount === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({ message: 'Restaurant updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating restaurant', error: err.message });
    }
});

// Delete a restaurant by id
router.delete('/:id', [authMiddleware, roleMiddleware(['admin'])], async (req, res) => {
    try {
        const deletedRowCount = await Restaurant.destroy({
            where: { id: req.params.id },
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting restaurant', error: err.message });
    }
});

// ... Add other CRUD operations for restaurants as needed

module.exports = router;