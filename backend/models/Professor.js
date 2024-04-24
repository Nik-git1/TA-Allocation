const mongoose = require( 'mongoose' );
// const argon2 = require( 'argon2' );

const professorSchema = new mongoose.Schema(
    {
        emailId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

module.exports = mongoose.model( 'Professor', professorSchema );