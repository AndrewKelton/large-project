const express = require('express');
const router = express.Router();
const Questionnaire = require('../models/questionnaire');

// POST - create a questionnaire
router.post('/', async (req, res) => {
    try {
        const { User, Course, Professor, Question, Option_A, Option_B, Option_C, Option_D } = req.body;

        if (!Question) {
            return res.status(400).json({ message: 'write a question' });
        }

        if (!Option_A || !Option_B) {
            return res.status(400).json({ message: 'add a MC option' });
        }

        if (!User || !Course) {
            return res.status(400).json({ message: 'User and Course are required' });
        }

        const questionnaire = await Questionnaire.create({
            User,
            Course,
            Professor: Professor || null,
            Question,
            Option_A,
            Option_B,
            Option_C: Option_C || null,
            Option_D: Option_D || null
        });

        res.status(201).json(questionnaire);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
