const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    // User information
    First_Name: {
        type: String
    },
    Last_Name: {
        type: String
    },
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },

    // Reference Entries
    Answered_Questionnaires: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questionnaire'
    }],
    Rated_Courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    Rated_Courses_Professors: [{
        Course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        Professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor' }
    }],

    // User metadata
    Date_Created: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema, 'Users');
module.exports = User;