import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true },
);
likeSchema.index({ post: 1, user: 1 }, { unique: true });

export const Like = mongoose.model("like", likeSchema);
