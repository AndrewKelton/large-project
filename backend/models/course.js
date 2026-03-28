const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    
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