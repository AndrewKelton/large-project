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
        required: true
    }
});

const Course = mongoose.model('Course', CourseSchema, 'Courses');
module.exports = Course;