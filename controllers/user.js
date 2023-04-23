const { User } = require('../models');
const { sendResponse } = require('../helpers/responseHelper');

const getAllUsers = async (req, res) => {
  
  try {
    const users = await User.findAll({
      attributes: ['id', 'email'],
    });
    sendResponse(res, 200, true, null, users);
  } catch (err) {
    sendResponse(res, 500, false, 'Error fetching users', err.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'email'],
    });

    if (!user) {
      return sendResponse(res, 404, false, 'User not found', null);
    }

    sendResponse(res, 200, true, null, user);
  } catch (err) {
    sendResponse(res, 500, false, 'Error fetching user', err.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
};
