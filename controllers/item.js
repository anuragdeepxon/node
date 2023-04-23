const express = require('express');
const { Item } = require('../models');
const router = express.Router();

// Get all items for a restaurant
const getItemsByRestaurant = async (req, res) => {
  try {
    const items = await Item.findAll({ where: { restaurantId: req.params.id } });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
};

const createItem = async (req, res) => {
  try {
    const item = await Item.create({
      name: req.body.name,
      price: req.body.price,
      restaurantId: req.body.restaurantId,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error creating item', error: err.message });
  }
};

// Update an item by id
const updateItem = async (req, res) => {
  try {
    const [updatedRowCount] = await Item.update(
      {
        name: req.body.name,
        price: req.body.price,
      },
      {
        where: { id: req.params.id },
      }
    );

    if (updatedRowCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating item', error: err.message });
  }
};

// Delete an item by id
const deleteItem = async (req, res) => {
  try {
    const deletedRowCount = await Item.destroy({
      where: { id: req.params.id },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
};

module.exports = {
  getItemsByRestaurant,
  createItem,
  updateItem,
  deleteItem,
};
