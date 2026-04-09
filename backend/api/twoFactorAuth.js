const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/user');
const { sendMail } = require('./mailman');

// Generate code
function generateCode(len = 6) {
    return Math.floor(10 ** (len - 1) + Math.random() * 9 * 10 ** (len - 1)).toString();
}

// 2FA send code
router.post('/2fa/send', async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const code = generateCode(6);
        user.TwoFA_Code = code;
        user.TwoFA_Expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
        await user.save();

        await sendMail({
            to: user.Email,
            subject: 'Your 2FA Code',
            text: `Your 2FA code is: ${code}`
        });

        res.json({ message: '2FA code sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2FA verify code
router.post('/2fa/verify', async (req, res) => {
    try {
        const { userId, code } = req.body;
        const user = await User.findById(userId);
        if (!user || !user.TwoFA_Code) {
            return res.status(400).json({ message: '2FA not initialized' });
        }

        if (user.TwoFA_Expires < new Date()) {
            return res.status(400).json({ message: '2FA code expired' });
        }

        if (user.TwoFA_Code !== code) {
            return res.status(400).json({ message: 'Invalid 2FA code' });
        }

        // clear code after success
        user.TwoFA_Code = undefined;
        user.TwoFA_Expires = undefined;
        await user.save();

        res.json({ message: '2FA verified' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Password reset request
router.post('/password/reset/request', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ Email: email });
        if (!user) {
            // do not reveal existence
            return res.json({ message: 'If that email exists, a reset link was sent' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.Reset_Token = token;
        user.Reset_Expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

        await sendMail({
            to: user.Email,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`
        });

        res.json({ message: 'If that email exists, a reset link was sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Password reset confirmation
router.post('/password/reset/confirm', async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        const user = await User.findOne({ Email: email, Reset_Token: token });

        if (!user || !user.Reset_Expires || user.Reset_Expires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.Password = hashed;
        user.Reset_Token = undefined;
        user.Reset_Expires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;