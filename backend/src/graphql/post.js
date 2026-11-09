import { getUserInfoById } from "../services/users.js";
import { Like } from "../db/models/like.js";

export const postSchema = `#graphql
type Post {
id: ID!
title: String!
author: User
contents: String
imageUrl: String
tags: [String!]
createdAt: Float
updatedAt: Float
likeCount: Int!
likedByMe: Boolean! 
}
`;
export const postResolver = {
  Post: {
    author: async (post) => {
      return await getUserInfoById(post.author);
    },
    likeCount: async (post) => {
      return await Like.countDocuments({ post: post._id }).exec();
    },
    likedByMe: async (post, args, { auth }) => {
      if (!auth) return false;
      return !!(await Like.exists({ post: post._id, user: auth.sub }));
    },
  },
};
