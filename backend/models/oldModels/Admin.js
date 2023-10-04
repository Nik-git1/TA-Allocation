const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        studentAccess: {
            type: Boolean,
            default: false,
        },
        jmAccess: {
            type: Boolean,
            default: false,
        },
        isCurrentSemester: {
            type: Boolean,
            default: true,
        },
        semName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

module.exports = mongoose.model('Admin', adminSchema);