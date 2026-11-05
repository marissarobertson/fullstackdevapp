import { gql } from "@apollo/client/core/index.js";

export const TOGGLE_LIKE = gql`
  mutation toggleLike($postId: ID!) {
    toggleLike(postId: $postId) {
      liked
      likeCount
    }
  }
`;
