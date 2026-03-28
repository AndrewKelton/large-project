const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
    First_Name: {
        type: String
    },
    Last_Name: {
        type: String
    },
    Answered_Questionnaires: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questionnaire'
    }],
    Date_Created: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema, 'Users');
module.exports = User;
