const { Cart, CartItem, Order, OrderItem } = require('../models');
const { sendResponse } = require('../helpers/responseHelper');

const checkout = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ where: { userId } });

        if (!cart) {
            return sendResponse(res, 404, false, 'Cart not found', null);
        }

        const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });

        if (cartItems.length === 0) {
            return sendResponse(res, 400, false, 'Cart is empty', null);
        }

        // Calculate the total cost
        let totalCost = 0;
        cartItems.forEach(item => {
            totalCost += item.price * item.quantity;
        });

        // Create an order
        const order = await Order.create({ userId, totalCost });

        // Add order items
        const orderItems = cartItems.map(item => {
            return {
                productId: item.productId,
                quantity: item.quantity,
                orderId: order.id
            };
        });

        await OrderItem.bulkCreate(orderItems);

        // Clear the cart
        await CartItem.destroy({ where: { cartId: cart.id } });

        // (Optional) Integrate with a payment gateway to process payments

        sendResponse(res, 200, true, 'Checkout successful', { order });
    } catch (err) {
        sendResponse(res, 400, false, 'Error processing checkout', err.message);
    }
};

module.exports = {
    checkout
};
