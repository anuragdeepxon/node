const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const { getAllUsers, getUserById } = require('../controllers/user');
const router = express.Router();

// Get all users
router.get('/', authMiddleware, getAllUsers);

// Get a specific user by id
router.get('/:id', authMiddleware, getUserById);

module.exports = router;





