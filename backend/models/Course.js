const mongoose = require( 'mongoose' );

const courseSectionSchema = new mongoose.Schema( {
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
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

const courseSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
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
    credits: {
        type: Number,
        required: true,
        default: 4,
    },
    sections: [ courseSectionSchema ],
} );

module.exports = mongoose.model( 'Course', courseSchema );;