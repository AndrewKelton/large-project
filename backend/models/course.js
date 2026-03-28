const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    
    // Course information
    Code: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    }
});

const Course = mongoose.model('Course', CourseSchema, 'Courses')