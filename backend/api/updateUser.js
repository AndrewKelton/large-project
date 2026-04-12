const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// PUT update user settings
router.put('/:userId', async (req, res) => {
    try {
        const { Username, Email, First_Name, Last_Name, Password } = req.body;

        // Check if username already taken by another user
        if (Username) {
            const existingUsername = await User.findOne({ Username, _id: { $ne: req.params.userId } });
            if (existingUsername) return res.status(400).json({ message: 'Username already taken!' });
        }

        // Check if email already taken by another user
        if (Email) {
            const existingEmail = await User.findOne({ Email, _id: { $ne: req.params.userId } });
            if (existingEmail) return res.status(400).json({ message: 'Email already registered!' });
        }

        const updateFields = {};
        if (Username !== undefined) updateFields.Username = Username;
        if (Email !== undefined) updateFields.Email = Email;
        if (First_Name !== undefined) updateFields.First_Name = First_Name;
        if (Last_Name !== undefined) updateFields.Last_Name = Last_Name;
        if (Password) updateFields.Password = await bcrypt.hash(Password, 10);

        const updated = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-Password');

        if (!updated) return res.status(404).json({ message: 'User not found' });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
