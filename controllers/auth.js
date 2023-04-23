const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (err) {
    res.status(400).json({ message: 'Error logging in', error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
        pass: process.env.SMTP_PASS
      }
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
        return res.status(500).json({ message: 'Error sending email', error: err.message });
      }

      res.status(200).json({ message: 'Reset password email sent' });
    });
  } catch (err) {
    res.status(400).json({ message: 'Error processing forgot password request', error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Clear the OTP and expiration date
    await user.update({ otp: null, otpExpires: null });

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error processing forgot password request', error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    await user.update({ password: hashedPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error updating password', error: err.message });
  }
};



module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  updatePassword
};