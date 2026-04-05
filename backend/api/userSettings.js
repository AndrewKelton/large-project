const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET user settings by user ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-Password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
