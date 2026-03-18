const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/users');
 
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_here';
 
const signToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};
 
router.post('/', [
    body('Username')
        .notEmpty().withMessage('Username is required!')
        .trim(),
    body('Password')
        .isLength({ min: 5 }).withMessage('Password must be at least 6 characters.'),
    body('Email')
        .isEmail().withMessage('Must be a valid email!')
        .normalizeEmail()
], async (req, res) => {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    try {
        const { Username, Password, Email } = req.body;
 
        // Check if username exists
        const existingUsername = await User.findOne({ Username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken!' });
        }
 
        // Check if email exists
        const existingEmail = await User.findOne({ Email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered!' });
        }
 
        // Create the user
        const user = await User.create({ Username, Password, Email });
 
        res.status(201).json({
            message: 'Account created successfully',
            token: signToken(user._id),
            user
        });
 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;