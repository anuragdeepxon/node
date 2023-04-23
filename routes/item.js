const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const {
  getItemsByRestaurant,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/item');
const router = express.Router();

// Get all items for a restaurant
router.get('/restaurant/:id', getItemsByRestaurant);

// Create a new item
router.post('/', [authMiddleware, roleMiddleware(['admin'])], createItem);

// Update an item by id
router.put('/:id', [authMiddleware, roleMiddleware(['admin'])], updateItem);

// Delete an item by id
router.delete('/:id', [authMiddleware, roleMiddleware(['admin'])], deleteItem);

module.exports = router;
