const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');

// GET average course-specific ratings for a course
router.get('/course/:courseId', async (req, res) => {
    try {
        const ratings = await Rating.find({ Course: req.params.courseId });
        if (!ratings.length) return res.status(404).json({ message: 'No ratings found' });

        const total = ratings.length;
        const avg = (field) => parseFloat((ratings.reduce((sum, r) => sum + (r[field] || 0), 0) / total).toFixed(2));

        res.json({
            totalRatings: total,
            averageQ1: avg('Option_A_Count'),
            averageQ2: avg('Option_B_Count'),
            averageQ3: avg('Option_C_Count'),
            averageQ4: avg('Option_D_Count'),
            averageQ5: avg('Option_E_Count')
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET average course+professor-specific ratings for a course+professor pair
router.get('/course/:courseId/professor/:professorId', async (req, res) => {
    try {
        const ratings = await Rating.find({
            Course: req.params.courseId,
            Professor: req.params.professorId,
            Professor_Rated: true
        });
        if (!ratings.length) return res.status(404).json({ message: 'No professor ratings found' });

        const total = ratings.length;
        const avg = (field) => parseFloat((ratings.reduce((sum, r) => sum + (r[field] || 0), 0) / total).toFixed(2));

        res.json({
            totalProfessorRatings: total,
            averageQ6: avg('Option_F_Count'),
            averageQ7: avg('Option_G_Count'),
            averageQ8: avg('Option_H_Count'),
            averageQ9: avg('Option_I_Count'),
            averageQ10: avg('Option_J_Count')
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
