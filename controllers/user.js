const express = require('express');
const { User } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get all users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email'],
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Get a specific user by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'email'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

module.exports = router;
