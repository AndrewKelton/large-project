const express = require('express');
const router = express.Router();

const Questionnaire = require('../models/questionnaire');
const User = require('../models/user');

// POST: respond to a questionnaire where professor = null
router.post('/:questionnaireId/respond', async (req, res) => {
    try {
        const { questionnaireId } = req.params;
        const { userId, response } = req.body;

        // Validate response input
        if (!["A", "B", "C", "D"].includes(response)) {
            return res.status(400).json({ message: "Invalid response option" });
        }

        // Fetch questionnaire
        const questionnaire = await Questionnaire.findById(questionnaireId);
        if (!questionnaire) {
            return res.status(404).json({ message: "Questionnaire not found" });
        }

        // Ensure this is a course-only questionnaire
        if (questionnaire.Professor !== null && questionnaire.Professor !== undefined) {
            return res.status(400).json({
                message: "This questionnaire is not course-only (professor is assigned)"
            });
        }

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // User cannot answer their own questionnaire
        if (questionnaire.User.toString() === userId) {
            return res.status(403).json({
                message: "You cannot answer your own questionnaire"
            });
        }

        // User cannot answer the same questionnaire twice
        if (user.Answered_Questionnaires.includes(questionnaireId)) {
            return res.status(403).json({
                message: "You have already answered this questionnaire"
            });
        }

        // Must have rated the course
        if (!user.Rated_Courses.some(id => id.toString() === questionnaire.Course.toString())) {
            return res.status(403).json({
                message: "You must rate the course before answering this questionnaire"
            });
        }

        // Check if the selected option actually exists
        const optionField = `Option_${response}`;
        const countField = `Option_${response}_Count`;

        if (!questionnaire[optionField]) {
            return res.status(400).json({
                message: `Option ${response} does not exist for this questionnaire`
            });
        }

        // Increment the appropriate counter
        questionnaire[countField] += 1;
        questionnaire.markModified(countField);

        // Save questionnaire update
        await questionnaire.save();

        // Add questionnaire to user's answered list
        user.Answered_Questionnaires.push(questionnaireId);
        await user.save();

        return res.json({
            message: "Response recorded successfully",
            questionnaireId,
            response
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;