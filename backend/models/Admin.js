const mongoose = require( 'mongoose' );
// const argon2 = require( 'argon2' );

const adminSchema = new mongoose.Schema(
    {
        emailId: {
            type: String,
            required: true,
            unique: true,
        },
        Password:{
            type: String,
            required: true,
        },
        jmAccess: {
            type: Boolean,
            default: false,
        },
        professorAccess: {
            type: Boolean,
            default: false,
        },
        studentFormAccess: {
            type: Boolean,
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