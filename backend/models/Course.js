const mongoose = require( 'mongoose' );

const courseSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    acronym: {
        type: String,
        required: true,
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
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
        default: null,
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
    antiPref: {
        type: Number,
        required: true,
        default: 0
    },
    taRequired: {
        type: Number,
        default: function ()
        {
            // Calculate the default value
            return Math.floor( this.totalStudents / this.taStudentRatio );
        }
    },
    taAllocated: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    } ],
} );


courseSchema.index( { acronym: 1, professor: 1, name: 1 }, { unique: true } );

module.exports = mongoose.model( 'Course', courseSchema );