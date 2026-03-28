const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    Code: {
        type: String
    },
    Title: {
        type: String
    }
});

const Course = mongoose.model('Course', CourseSchema, 'Courses')