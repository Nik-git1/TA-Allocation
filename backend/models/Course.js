const mongoose = require( 'mongoose' );

const courseSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    acronym: String,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JM',
        required: true,
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
    },
    credits: Number,
    totalStudents: Number,
    taStudentRatio: String, // You can validate the format separately
    taRequired: Number,
    taAllocated: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    } ],
} );

module.exports = mongoose.model( 'Course', courseSchema );;