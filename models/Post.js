import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
