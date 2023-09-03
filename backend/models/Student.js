const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], // Adjust the enum values as needed
    },
    program: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
    },
    mandatoryTa: {
        type: Boolean,
        required: true,
        default: false,
    },
    year: {
        type: Number,
        required: true,
    },
    allocated: {
        type: Boolean,
        required: true,
        default: false, // Set a default value or adjust as needed
    },
});

module.exports = mongoose.model('Student', studentSchema);