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
    acronym: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JM',
        required: true,
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
    },
    credits: {
        type: Number,
        required: true,
        default: 4,
    },
    totalStudents: {
        type: Number,
        required: true,
    },
    taStudentRatio: {
        type: Number,
        required: true,
        min: 1
    },
    taRequired: Number,
    taAllocated: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    } ],
} );

module.exports = mongoose.model( 'Course', courseSchema );;