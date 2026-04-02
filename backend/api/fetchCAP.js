// routes/fetchCAP.js
const express = require('express');
const router = express.Router();

const Questionnaire = require('../models/questionnaire.js');
const Course = require('../models/course.js');
const Professor = require('../models/professor.js');

// GET all questionnaires for a course + professor
router.get('/course/:courseId/professor/:professorId', async (req, res) => {
    try {
        const { courseId, professorId } = req.params;

        // Validate course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Validate professor exists
        const professor = await Professor.findById(professorId);
        if (!professor) {
            return res.status(404).json({ message: 'Professor not found' });
        }

        // Fetch questionnaires with matching course + professor
        const questionnaires = await Questionnaire.find({
            Course: courseId,
            Professor: professorId
        })
        .populate('User', 'Username Email First_Name Last_Name')
        .populate('Course', 'Name Code')
        .populate('Professor', 'First_Name Last_Name');

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
            Course: q.Course,
            Professor: q.Professor
        }));

        return res.json({
            Course: {
                _id: course._id,
                Name: course.Name,
                Code: course.Code
            },
            Professor: {
                _id: professor._id,
                First_Name: professor.First_Name,
                Last_Name: professor.Last_Name
            },
            Questionnaires: formatted
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
