const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({

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
        ref: 'User',
        required: true
    },

    // COURSE rating information -- question agnostic, static on frontend (5 max)
    Option_A_Count: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    Option_B_Count: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    Option_C_Count: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    Option_D_Count: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    Option_E_Count: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },

    // PROFESSOR rating information
    Professor_Rated: {
        type: Boolean,
        default: false
    },
    Option_F_Count: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    Option_G_Count: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    Option_H_Count: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    Option_I_Count: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    Option_J_Count: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },

    // Rating metadata
    Date_Created: {
        type: Date,
        default: Date.now
    }
});

const Rating = mongoose.model('Rating', RatingSchema, 'Ratings');
module.exports = Rating;
