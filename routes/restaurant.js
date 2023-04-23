const express = require('express');
const { getAllRestaurants, createRestaurant, getRestaurantById, updateRestaurant, deleteRestaurant } = require('../controllers/restaurant');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', getAllRestaurants);
router.post('/', [authMiddleware, roleMiddleware(['admin'])], createRestaurant);
router.get('/:id', getRestaurantById);
router.put('/:id', [authMiddleware, roleMiddleware(['admin'])], updateRestaurant);
router.delete('/:id', [authMiddleware, roleMiddleware(['admin'])], deleteRestaurant);

module.exports = router;
