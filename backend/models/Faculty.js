const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
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
        courses: {
            type: [Schema.Types.ObjectId],
            ref: "Course",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

module.exports = mongoose.model("Faculty", facultySchema);
