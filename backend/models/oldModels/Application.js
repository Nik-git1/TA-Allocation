const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        semName: {
            type: String,
            required: true,
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        jm: {
            type: Schema.Types.ObjectId,
            ref: "JM",
            default: null,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            default: null,
        },
        faculty: {
            type: Schema.Types.ObjectId,
            ref: "Faculty",
            default: null,
        },
        cgpa: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        preferences: {
            type: [Schema.Types.ObjectId],
            ref: "Course",
        },
        grades: {
            type: [String],
            required: true,
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

module.exports = mongoose.model('Application', applicationSchema);
