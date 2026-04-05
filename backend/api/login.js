const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Plug in enviroment variable here
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_here';

const User = require('../models/user.js'); // User model location

// POST - Login
router.post('/login', async (req, res) => {
    const { Username, Password } = req.body;

    try {
        // Does user exist?
        const user = await User.findOne({ Username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Password check!
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.Username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login WORKING NOW',
            token,
            user: user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
