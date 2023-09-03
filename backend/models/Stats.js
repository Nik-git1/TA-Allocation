import mongoose, { Schema } from "mongoose";

const statsSchema = new Schema(
    {
        visitors: {
            type: Number,
            default: 0,
        },
        registrations: {
            type: Number,
            default: 0,
        },
        activeUsers: {
            type: Number,
            default: 0,
        },
        requests: {
            type: Number,
            default: 0,
        },
        totalUsers: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
);

mongoose.models = {};

export default mongoose.model("Stats", statsSchema);