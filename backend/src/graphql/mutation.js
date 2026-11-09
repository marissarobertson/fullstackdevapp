import { GraphQLError } from "graphql";
import { createUser, loginUser } from "../services/users.js";
import { createPost } from "../services/posts.js";
import { Like } from "../db/models/like.js";

export const mutationSchema = `#graphql
type LikeResult {
  liked: Boolean!
  likeCount: Int!
}

type Mutation {
signupUser(username: String!, password: String!): User
loginUser(username: String!, password: String!): String
createPost(title: String!, contents: String, imageUrl: String, tags:[String]): Post
toggleLike(postId: ID!): LikeResult!
}
`;
export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      return await createUser({ username, password });
    },
    loginUser: async (parent, { username, password }) => {
      return await loginUser({ username, password });
    },
    toggleLike: async (parent, { postId }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          "You need to be authenticated to perform this action.",
          { extensions: { code: "UNAUTHORIZED" } },
        );
      }
      const removed = await Like.findOneAndDelete({
        post: postId,
        user: auth.sub,
      });
      if (!removed) await Like.create({ post: postId, user: auth.sub });
      const likeCount = await Like.countDocuments({ post: postId }).exec();
      return { liked: !removed, likeCount };
    },
    createPost: async (
      parent,
      { title, contents, imageUrl, tags },
      { auth },
    ) => {
      if (!auth) {
        throw new GraphQLError(
          "You need to be authenticated to perform this action.",
          {
            extensions: {
              code: "UNAUTHORIZED",
            },
          },
        );
      }
      return await createPost(auth.sub, { title, contents, imageUrl, tags });
    },
  },
};
