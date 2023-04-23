const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, verifyOTP, updatePassword } = require('../controllers/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

// Verify OTP
router.post('/verify-otp', verifyOTP);

// Update password
router.post('/update-password', updatePassword);

module.exports = router;