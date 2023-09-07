const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
    },
    studentDepartment: {
        type: String,
        required: true,
    },
    courseDepartment: {
        type: String,
        required: true,
    },
    allocatedOn: {
        type: Date,
        default: Date.now, // Set a default value to the current date and time
    },
    courseName: {
        type: String,
        required: true,
    },
    courseCode: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Allocation', allocationSchema);