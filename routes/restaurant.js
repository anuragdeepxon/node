const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const {
  getRestaurants,
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurant');
const router = express.Router();

// Get all restaurants
router.get('/', getRestaurants);

// Create a new restaurant
router.post('/', [authMiddleware, roleMiddleware(['admin'])], createRestaurant);

// Get a specific restaurant by id
router.get('/:id', getRestaurant);

// Update a restaurant by id
router.put('/:id', [authMiddleware, roleMiddleware(['admin'])], updateRestaurant);

// Delete a restaurant by id
router.delete('/:id', [authMiddleware, roleMiddleware(['admin'])], deleteRestaurant);

module.exports = router;
