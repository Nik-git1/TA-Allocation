const mongoose = require('mongoose');

const jmSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        emailId: {
            type: String,
            required: true,
            index: true,
        },
        department: {
            type: String,
            required: true,
        },
        choices: {
            type: [Schema.Types.ObjectId],
            ref: "Application",
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

module.exports = mongoose.model('JM', jmSchema);
