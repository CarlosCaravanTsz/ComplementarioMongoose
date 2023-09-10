import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
});

export default mongoose.model(userCollection, userSchema);
