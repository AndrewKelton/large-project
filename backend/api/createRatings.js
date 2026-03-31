const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');
const User = require('../models/user');

// POST: submit a rating
router.post('/', async (req, res) => {
    try {
        const {
            User: UserId, Course, Professor,
            Option_A_Count, Option_B_Count, Option_C_Count, Option_D_Count, Option_E_Count,
            Professor_Rated,
            Option_F_Count, Option_G_Count, Option_H_Count, Option_I_Count, Option_J_Count
        } = req.body;

        if (!UserId || !Course) return res.status(400).json({message: 'User and Course are required!'});

        const rating = await Rating.create({
            User: UserId, Course, Professor: Professor || null,
            Option_A_Count, Option_B_Count, Option_C_Count, Option_D_Count, Option_E_Count,
            Professor_Rated: Professor_Rated || false,
            Option_F_Count, Option_G_Count, Option_H_Count, Option_I_Count, Option_J_Count
        });

        // Append course to user's rated courses
        await User.findByIdAndUpdate(UserId, {
            $push: { Rated_Courses: Course }
        });

        // If professor was rated, append course+professor pair
        if (Professor_Rated && Professor) {
            await User.findByIdAndUpdate(UserId, {
                $push: { Rated_Courses_Professors: { Course, Professor } }
            });
        }

        res.status(201).json(rating);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET ratings for a course
router.get('/course/:courseId', async (req, res) => {
    try {
        const ratings = await Rating.find({ Course: req.params.courseId });
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET ratings for a course+professor pair
router.get('/course/:courseId/professor/:professorId', async (req, res) => {
    try {
        const ratings = await Rating.find({
            Course: req.params.courseId,
            Professor: req.params.professorId
        });
        res.json(ratings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
