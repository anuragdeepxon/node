const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');

const { sendResponse } = require('../helpers/responseHelper');

const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ where: { email: req.body.email } });

    if (existingUser) {
      return sendResponse(res, 400, false, 'User already exists', null);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return sendResponse(res, 500, false, 'Internal server error', null);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    sendResponse(res, 201, true, 'User registered successfully', {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    sendResponse(res, 400, false, 'Error registering user', err.message);
  }
};



const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return sendResponse(res, 404, false, 'User not found', null);
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return sendResponse(res, 401, false, 'Invalid password', null);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return sendResponse(res, 500, false, 'Internal server error', null);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    sendResponse(res, 200, true, 'Logged in successfully', { token });
  } catch (err) {
    console.error('Error logging in:', err);
    sendResponse(res, 400, false, 'Error logging in', err.message);
  }
};


const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return sendResponse(res, 404, false, 'User not found', null);
    }

    const otpGenerator = require('otp-generator');

    // Generate a buffer with 3 bytes of random data
    const buffer = crypto.randomBytes(3);

    // Convert the buffer to a six-digit decimal number
    const token = parseInt(buffer.toString('hex'), 16) % 1000000;

    await user.update({ otp: token, otpExpires: Date.now() + 3600000 });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) requested a password reset for your account.
OTP: ${token}
`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return sendResponse(res, 500, false, 'Error sending email', err.message);
      }

      sendResponse(res, 200, true, 'Reset password email sent', null);
    });
  } catch (err) {
    sendResponse(res, 400, false, 'Error processing forgot password request', err.message);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return sendResponse(res, 404, false, 'User not found', null);
    }

    if (user.otp !== otp) {
      return sendResponse(res, 400, false, 'Invalid OTP', null);
    }

    if (user.otpExpires < Date.now()) {
      return sendResponse(res, 400, false, 'OTP has expired', null);
    }

    // Clear the OTP and expiration date
    await user.update({ otp: null, otpExpires: null });

    sendResponse(res, 200, true, 'OTP verified successfully', null);
  } catch (err) {
    sendResponse(res, 400, false, 'Error processing forgot password request', err.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return sendResponse(res, 404, false, 'User not found', null);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    await user.update({ password: hashedPassword });

    sendResponse(res, 200, true, 'Password updated successfully', null);

  } catch (err) {

    sendResponse(res, 400, false, 'Error updating password', err.message);
  }
};


module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  updatePassword
};