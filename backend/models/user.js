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
    Name: {
        type: String
    },
    Date_Created: {
        type: Date,
        default: Date.now
    },

    // 2FA Fields required for NodeMailer
    otpCode: { type: String },
    otpExpires: { type: Date }
});

const User = mongoose.model('User', UserSchema, 'Users');
module.exports = User;
