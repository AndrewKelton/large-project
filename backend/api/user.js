const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// GET /api/user/:userId/answered-questionnaires
// Returns the list of questionnaire IDs the user has already answered
router.get('/:userId/answered-questionnaires', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('Answered_Questionnaires');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ answeredQuestionnaires: user.Answered_Questionnaires });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
