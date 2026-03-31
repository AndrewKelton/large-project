const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// GET all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: add a course
router.post('/', async (req, res) => {
    try {
        const { Name, Code } = req.body;
        if (!Name || !Code) return res.status(400).json({ message: 'Name and Code are required' });

        const course = await Course.create({ Name, Code });
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
