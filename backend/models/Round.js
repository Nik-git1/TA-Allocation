const mongoose = require( 'mongoose' );

const roundSchema = new mongoose.Schema(
    {
        currentRound: {
            type: Number,
            required: true,
            unique: true,
        },
        ongoing: {
            type: Boolean,
            default: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

module.exports = mongoose.model( 'Round', roundSchema );;