const { Restaurant } = require('../models');

// Get all restaurants
async function getRestaurants(req, res) {
  try {
    const restaurants = await Restaurant.findAll();
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurants', error: err.message });
  }
}

// Create a new restaurant
async function createRestaurant(req, res) {
  try {
    const restaurant = await Restaurant.create({
      name: req.body.name,
      location: req.body.location,
    });
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Error creating restaurant', error: err.message });
  }
}

// Get a specific restaurant by id
async function getRestaurant(req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching restaurant', error: err.message });
  }
}

// Update a restaurant by id
async function updateRestaurant(req, res) {
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
}

// Delete a restaurant by id
async function deleteRestaurant(req, res) {
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
}

module.exports = {
  getRestaurants,
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
