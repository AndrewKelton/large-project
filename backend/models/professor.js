const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfessorSchema = new Schema({
    
    // Professor information
    First_Name: {
        type: String,
        required: true
    },
    Last_Name: {
        type: String,
        required: true
    }
});

const Professor = mongoose.model('Professor', ProfessorSchema, 'Professors');
module.exports = Professor;