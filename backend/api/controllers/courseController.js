const Course = require('../models/course.js');

exports.searchCourses = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Partial match on Name or Code (case-insensitive)
        const regex = new RegExp(q, 'i');

        const results = await Course.find({
            $or: [
                { Name: regex },
                { Code: regex }
            ]
        });

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};