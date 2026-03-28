const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    
    
});

const Rating = mongoose.model('Rating', RatingSchema, 'Ratings');
module.exports = Rating;