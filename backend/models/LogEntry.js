const mongoose = require('mongoose');

const logEntrySchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    userEmailId: {
        type: String,
        required: true,
    },
    userRole :{
        type: String,
        required : true,
    },
    action: {
        type: String,
        enum: ['allocated', 'deallocated'],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    course :{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required : true, 
    },
});

module.exports = mongoose.model('LogEntry', logEntrySchema);
