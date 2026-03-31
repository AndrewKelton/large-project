const Professor = require('../models/professor');

exports.searchProfessors = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Partial match on First or Last Name (case-insensitive)
        const regex = new RegExp(q, 'i');

        const results = await Professor.find({
            $or: [
                { First_Name: regex },
                { Last_Name: regex }
            ]
        });

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};