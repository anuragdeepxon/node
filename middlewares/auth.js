const jwt = require('jsonwebtoken');
const { sendResponse } = require('../helpers/responseHelper');
const { User } = require('../models'); 

const roleMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
      const user = await User.findByPk(req.user.userId, {
        attributes: ['id', 'role'],
      });
  
      if (user && allowedRoles.includes(user.role)) {
        next();
      } else {
        sendResponse(res, 403, false, 'Forbidden', null);
      }
    };
  };

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return sendResponse(res, 401, false, 'Access denied. No token provided.', null);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId };
        next();
    } catch (err) {
        sendResponse(res, 400, false, 'Invalid token', null);
    }
};


module.exports = {
    authMiddleware,
    roleMiddleware,
};
