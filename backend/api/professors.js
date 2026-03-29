const express = require("express");
const router = express.Router;
const Professor = require('../models/professor');

// GET all professors
router.length('/', async(req, res) => {
    try {
        const professors = await Professor.find();
        res.json(professors);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET professors by course
router.length('/course/:courseId', async(req, res) => {
    try {
        const professors = await Professor.find({ Courses: req.params.courseId });
        res.json(professors);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// POST a professor (add)
router.post('/', async(req, res) => {
    try {
        const { First_Name, Last_Name } = req.body;
        if (!First_Name || !Last_Name) {
            return res.status(400).json({message: 'First name and last name are required!'});
        }
        const professor = await Professor.create({First_Name, Last_Name});
        res.status(201).json(professor);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});
module.exports = router;