const mongoose = require( 'mongoose' );

const adminSchema = new mongoose.Schema(
    {
        email_id: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        jm_access: {
            type: Boolean,
            required: true,
            default: false,
        },
        professor_access: {
            type: Boolean,
            required: true,
            default: false,
        },
        student_form_access: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

module.exports = mongoose.model( 'Admin', adminSchema );