const express = require('express');
const { getAllItems, createItem, getItemById, updateItem, deleteItem } = require('../controllers/item');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', getAllItems);
router.post('/', [authMiddleware, roleMiddleware(['admin'])], createItem);
router.get('/:id', getItemById);
router.put('/:id', [authMiddleware, roleMiddleware(['admin'])], updateItem);
router.delete('/:id', [authMiddleware, roleMiddleware(['admin'])], deleteItem);

module.exports = router;
