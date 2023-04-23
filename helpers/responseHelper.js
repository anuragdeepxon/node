function sendResponse(res, code, success, message, data) {
    res.status(code).json({
      code,
      success,
      message,
      data,
    });
  }
  
  module.exports = {
    sendResponse,
  };
  