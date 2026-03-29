const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    // Course Name
    Name: {
        type: String,
        required: true
    },
    // Course Code
    Code: {
        type: String,
        required: true,
        unique: true
    },
    Questionnaires: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questionnaire'
    }]
});

const Course = mongoose.model('Course', CourseSchema, 'Courses');
module.exports = Course;
