const { User, Cart, CartItem } = require('../models');

// Add item to cart
const addItemToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let cart = await user.getCart();
        if (!cart) {
            cart = await user.createCart();
        }

        let cartItem = await cart.getCartItem({ where: { productId } });
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await cart.createCartItem({ productId, quantity });
        }

        res.status(201).json({ message: 'Item added to cart', cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cart = await user.getCart();
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = await cart.getCartItem({ where: { productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'CartItem not found' });
        }

        await cartItem.destroy();
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
};

// Update item quantity
const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cart = await user.getCart();
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = await cart.getCartItem({ where: { productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'CartItem not found' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        res.status(200).json({ message: 'Item quantity updated', cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Error updating item quantity', error });
    }
};


// Get cart items
const getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cart = await user.getCart();
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItems = await cart.getCartItems();
        res.status(200).json({ message: 'Cart items fetched', cartItems });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error });
    }
};

module.exports = {
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    getCartItems,
};
