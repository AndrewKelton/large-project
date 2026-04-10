const express = require('express');
const router = express.Router();

const Questionnaire = require('../models/questionnaire');

// GET: Search professor-specific questionnaires by question text
router.get('/search', async (req, res) => {
    try {
        const { query, courseId, professorId } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Search query is required" });
        }

        if (!courseId || !professorId) {
            return res.status(400).json({ message: "courseId and professorId are required" });
        }

        const results = await Questionnaire.find({
            Course: courseId,
            Professor: professorId,
            Question: { $regex: query, $options: "i" }
        })
        .populate('Course', 'Name Code')
        .populate('Professor', 'First_Name Last_Name')
        .populate('User', 'Username Email First_Name Last_Name');

        return res.json({
            query,
            courseId,
            professorId,
            count: results.length,
            results
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;