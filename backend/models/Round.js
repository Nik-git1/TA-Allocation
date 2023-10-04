const mongoose = require( 'mongoose' );

const roundSchema = new mongoose.Schema(
    {
        current_round: {
            type: Number,
            required: true,
            unique: true,
        },
        ongoing: {
            type: Boolean,
            required: true,
            default: true,
        },
        start_date: {
            type: String,
        },
        end_date: {
            type: String,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

module.exports = mongoose.model( 'Round', roundSchema );