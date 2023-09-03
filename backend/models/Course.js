const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    acronym: {
        type: String,
        required: true,
    },
    offeredTo: {
        type: String,
        required: true,
    },
    aboveHundred: {
        type: Boolean,
        required: true,
    },
    allocated: {
        type: Number,
        default: 0, // Set a default value or adjust as needed
    },
});

module.exports = mongoose.model('Course', courseSchema);