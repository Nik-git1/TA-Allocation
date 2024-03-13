const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default : 5,
        min: 0,
        max: 5
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
