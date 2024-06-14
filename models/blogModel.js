const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxLength: 160
    },
    image: {
        type: String,
        required: [true, "Image is required"],
        default: "https://picsum.photos/seed/animals/500/600"
    },
    likedBy: [{
        type: mongoose.Types.ObjectId,
    }],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true })

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;