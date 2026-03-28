const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionnaireSchema = new Schema({
    
    // Reference entries
    Course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    Professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor'
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    // Questionnaire options + counters
    Question: {
        type: String,
        required: true
    },
    Option_A: {
        type: String,
        required: true
    },
    Option_B: {
        type: String,
        required: true
    },
    Option_C: {
        type: String
    },
    Option_D: {
        type: String
    },
    Option_A_Count: {
        type: Number,
        default: 0
    },
    Option_B_Count: {
        type: Number,
        default: 0
    },
    Option_C_Count: {
        type: Number,
        default: 0
    },
    Option_D_Count: {
        type: Number,
        default: 0
    },

    // Questionnaire metadata
    Date_Created: {
        type: Date,
        default: Date.now
    }
});

const Questionnaire = mongoose.model('Questionnaire', QuestionnaireSchema, 'Questionnaires');
module.exports = Questionnaire;