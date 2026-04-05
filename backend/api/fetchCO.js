// routes/fetchCO.js
const express = require('express');
const router = express.Router();

const Questionnaire = require('../models/questionnaire.js');
const Course = require('../models/course.js');

// GET all questionnaires for a course where professor is NULL
router.get('/course/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;

        // Validate course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch questionnaires with professor = null
        const questionnaires = await Questionnaire.find({
            Course: courseId,
            Professor: null
        })
        .populate('User', 'Username Email First_Name Last_Name')
        .populate('Course', 'Name Code');

        // Format response
        const formatted = questionnaires.map(q => ({
            Question: q.Question,
            Options: {
                A: q.Option_A || null,
                B: q.Option_B || null,
                C: q.Option_C || null,
                D: q.Option_D || null
            },
            Counts: {
                A: q.Option_A_Count ?? null,
                B: q.Option_B_Count ?? null,
                C: q.Option_C_Count ?? null,
                D: q.Option_D_Count ?? null
            },
            User: q.User,
            Course: q.Course
        }));

        return res.json({
            Course: {
                _id: course._id,
                Name: course.Name,
                Code: course.Code
            },
            Questionnaires: formatted
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
