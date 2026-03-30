const express = require('express');
const router = express.Router();
const { searchProfessors } = require('../controllers/professorController');

router.get('/search', searchProfessors);

module.exports = router;