const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/user');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

router.get('/', [authMiddleware, roleMiddleware(['admin'])], getAllUsers);
router.get('/:id', [authMiddleware, roleMiddleware(['admin'])], getUserById);
router.put('/:id', [authMiddleware, roleMiddleware(['admin'])], updateUser);
router.delete('/:id', [authMiddleware, roleMiddleware(['admin'])], deleteUser);

module.exports = router;
