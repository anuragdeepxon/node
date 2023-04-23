const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const restaurantRoutes = require('./routes/restaurant');
const orderRoutes = require('./routes/order');
const itemRoutes = require('./routes/item');

// Use routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/orders', orderRoutes);
app.use('/items', itemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await sequelize.authenticate();
    console.log('Connected to the database');
});
