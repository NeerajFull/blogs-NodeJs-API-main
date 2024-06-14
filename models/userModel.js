const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "User already exist"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    likedBlogs: [{
        type: mongoose.Types.ObjectId,
        ref: "Blog"
    }],
    blogs: [{
        type: mongoose.Types.ObjectId,
        ref: "Blog"
    }]
}, { timestamps: true })

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;