const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
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
