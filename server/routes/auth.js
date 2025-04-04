
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require('crypto');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user in database
    const user = await User.findOne({ email, role });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    // Return user data (without password)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user with hashed password
    const newUser = new User({
      ...req.body,
      password: hashedPassword
    });
    
    await newUser.save();
    
    // Return created user data (without password)
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, role } = req.body;
    
    // Find user in database
    const user = await User.findOne({ email, role });
    
    // Even if no user is found, we return success to avoid leaking information
    if (!user) {
      return res.status(200).json({ message: 'Password reset link sent if email exists' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Save token and expiry to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
    
    // In a real app, send an email with the reset link
    // For development, log the token
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link would be: /reset-password/${resetToken}`);
    
    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Find user with this token and check if token is still valid
    const user = await User.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Update user with new password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.status(200).json({ message: 'Password has been reset successfully' });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check auth status route
router.get('/status', async (req, res) => {
  // In a real app, this would check JWT or session
  res.status(200).json({ isAuthenticated: false, user: null });
});

module.exports = router;
