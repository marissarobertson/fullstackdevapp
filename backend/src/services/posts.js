import { Post } from "../db/models/post.js";
import { User } from "../db/models/user.js";
import { Like } from "../db/models/like.js";

export async function createPost(userId, { title, contents, imageUrl, tags }) {
  const post = new Post({ title, author: userId, contents, imageUrl, tags });
  return await post.save();
}
async function listPosts(
  query = {},
  { sortBy = "createdAt", sortOrder = "descending" } = {},
) {
  if (sortBy === "likeCount") {
    const docs = await Post.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      { $addFields: { likeCount: { $size: "$likes" } } },
      { $project: { likes: 0 } },
      {
        $sort: { likeCount: sortOrder === "ascending" ? 1 : -1, createdAt: -1 },
      },
    ]);
    return docs.map((doc) => Post.hydrate(doc));
  }
  return await Post.find(query).sort({ [sortBy]: sortOrder });
}

export async function listAllPosts(options) {
  return await listPosts({}, options);
}
export async function listPostsByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername });
  if (!user) return [];
  return await listPosts({ author: user._id }, options);
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options);
}

export async function getPostById(postId) {
  return await Post.findById(postId);
}

export async function getTopPosts(limit = 5) {
  const rows = await Like.aggregate([
    { $group: { _id: "$post", likeCount: { $sum: 1 } } },
    { $sort: { likeCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "_id",
        as: "post",
      },
    },
    { $unwind: "$post" },
  ]);
  return rows.map((r) => Post.hydrate(r.post));
}

export async function updatePost(
  userId,
  postId,
  { title, contents, imageUrl, tags },
) {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, contents, imageUrl, tags } },
    { new: true },
  );
}

export async function deletePost(userId, postId) {
  return await Post.deleteOne({ _id: postId, author: userId });
}
