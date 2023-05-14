import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        username: { type: String, required: true },
        categories: { type: [String], required: false },
        photo: { type: String, required: false },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
