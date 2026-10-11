import mongoose, { Schema } from "mongoose";

// Recipe post: title, ingredients (contents), optional image, and tags
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "user", required: true },
    contents: String,
    imageUrl: String,
    tags: [String],
  },

  { timestamps: true },
);

export const Post = mongoose.model("post", postSchema);
