const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const { sendMail } = require('./mailman');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_here';

const signToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

router.post('/', [
    body('Username')
        .notEmpty().withMessage('Username is required!')
        .trim(),
    body('Password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters.'),
    body('Email')
        .isEmail().withMessage('Must be a valid email!')
        .normalizeEmail(),
    body('First_Name')
        .notEmpty().withMessage('First name is required!')
        .trim(),
    body('Last_Name')
        .notEmpty().withMessage('Last name is required!')
        .trim()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { First_Name, Last_Name, Username, Password, Email } = req.body;

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

        // Hash password and create the user
        const hashedPassword = await bcrypt.hash(Password, 10);
        const user = await User.create({ First_Name, Last_Name, Username, Password: hashedPassword, Email });

        // Generate email verification token and send verification email
        const verifyToken = crypto.randomBytes(32).toString('hex');
        user.Email_Verification_Token = verifyToken;
        user.Email_Verification_Expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        const verifyLink = `${req.protocol}://${req.get('host')}/api/register/verify-email?token=${verifyToken}`;
        await sendMail({
            to: Email,
            subject: 'Verify your KnightRate email',
            text: `Welcome to KnightRate! Please verify your email by clicking the link below:\n\n${verifyLink}\n\nThis link expires in 24 hours.`
        });

        res.status(201).json({
            message: 'Account created successfully. Please check your email to verify your account.'
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/register/verify-email?token=<token>
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({
            Email_Verification_Token: token,
            Email_Verification_Expires: { $gt: Date.now() }
        });

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false`);
        }

        user.isEmailVerified = true;
        user.Email_Verification_Token = undefined;
        user.Email_Verification_Expires = undefined;
        await user.save();

        res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
