const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, name, email, password, role, skills } = req.body;

        // Check if username is already taken (case-insensitive)
        const existingUsername = await User.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken. Please choose another.' });
        }

        // Check if email + role combination already exists
        const existingEmailRole = await User.findOne({ email, role });
        if (existingEmailRole) {
            return res.status(400).json({ message: `A ${role} account with this email already exists.` });
        }

        const newUser = new User({ username: username.toLowerCase(), name, email, password, role, skills });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check username availability
router.post('/check-username', async (req, res) => {
    try {
        const { username } = req.body;
        const existingUser = await User.findOne({ username: username.toLowerCase() });
        res.json({ available: !existingUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate mock token (in real app, use crypto)
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // "Send" email by returning token in response (for development)
        // In production, send via Nodemailer/SendGrid
        console.log(`Reset Token for ${email}: ${token}`);
        res.json({ message: 'Password reset link sent to your email', token }); // Returning token for easy testing
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = newPassword; // Plain text as per existing pattern
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Return user info (no JWT for "mock/simple auth" request, just user object to store in frontend context)
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
