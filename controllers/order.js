const { Order } = require('../models');
const { sendResponse } = require('../helpers/responseHelper');


async function getOrders(req, res) {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.userId } });
    sendResponse(res, 200, true, null, orders);
  } catch (err) {
    sendResponse(res, 500, false, 'Error fetching orders', err.message);
  }
}

async function createOrder(req, res) {
  try {
    const order = await Order.create({
      userId: req.user.userId,
    });
    sendResponse(res, 201, true, null, order);
  } catch (err) {
    sendResponse(res, 500, false, 'Error creating order', err.message);
  }
}

async function getOrder(req, res) {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (!order) {
      return sendResponse(res, 404, false, 'Order not found', null);
    }

    sendResponse(res, 200, true, null, order);
  } catch (err) {
    sendResponse(res, 500, false, 'Error fetching order', err.message);
  }
}

async function updateOrder(req, res) {
  try {
    const [updatedRowCount] = await Order.update(
      {
        where: { id: req.params.id, userId: req.user.userId },
      }
    );

    if (updatedRowCount === 0) {
      return sendResponse(res, 404, false, 'Order not found', null);
    }

    sendResponse(res, 200, true, 'Order updated successfully', null);
  } catch (err) {
    sendResponse(res, 500, false, 'Error updating order', err.message);
  }
}

async function deleteOrder(req, res) {
  try {
    const deletedRowCount = await Order.destroy({
      where: { id: req.params.id, userId: req.user.userId },
    });

    if (deletedRowCount === 0) {
      return sendResponse(res, 404, false, 'Order not found', null);
    }

    sendResponse(res, 200, true, 'Order deleted successfully', null);
  } catch (err) {
    sendResponse(res, 500, false, 'Error deleting order', err.message);
  }
}

module.exports = {
  getOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
};
