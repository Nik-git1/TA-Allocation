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
    overallGrade: {
        type: String,
        enum: ['S', 'X'],
        required: true,
        default: 'S'
    },
    regularityInMeeting: {
        type: String,
        enum: ['Excellent', 'Very Good', 'Good', 'Average', 'Below Average'],
        default: 'Average'
    },
    attendanceInLectures: {
        type: String,
        enum: ['Excellent', 'Very Good', 'Good', 'Average', 'Below Average'],
        default: 'Average'
    },
    preparednessForTutorials: {
        type: String,
        enum: ['Excellent', 'Very Good', 'Good', 'Average', 'Below Average'],
        default: 'Average'
    },
    timelinessOfTasks: {
        type: String,
        enum: ['Excellent', 'Very Good', 'Good', 'Average', 'Below Average'],
        default: 'Average'
    },
    qualityOfWork: {
        type: String,
        enum: ['Excellent', 'Very Good', 'Good', 'Average', 'Below Average'],
        default: 'Average'
    },
    attitudeCommitment: {
        type: String,
        enum: ['Excellent', 'Very Good', 'Good', 'Average', 'Below Average'],
        default: 'Average'
    },
    nominatedForBestTA: {
        type: Boolean,
        default: false
    },
    comments: {
        type: String
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
