const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

const nodemailer = require('nodemailer');
const crypto = require('crypto');


// Register
router.post('/register', async (req, res) => {
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
});

// Login
router.post('/login', async (req, res) => {
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
});


// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    await user.update({ resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) requested a password reset for your account.
Please click on the following link, or paste it into your browser to complete the process:
http://${req.headers.host}/auth/reset-password/${token}
If you did not request this, please ignore this email and your password will remain unchanged.`,
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
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await user.update({ password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null });

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error resetting password', error: err.message });
  }
});


module.exports = router;
