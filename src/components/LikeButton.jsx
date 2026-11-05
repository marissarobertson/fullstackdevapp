import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { TOGGLE_LIKE } from "../api/graphql/likes.js";

export function LikeButton({ postId, initialLiked = false, initialCount = 0 }) {
  const [token] = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [toggleLike, { loading }] = useMutation(TOGGLE_LIKE, {
    variables: { postId },
    refetchQueries: ["getTopPosts"],
    onCompleted: (data) => {
      setLiked(data.toggleLike.liked);
      setCount(data.toggleLike.likeCount);
    },
    onError: (err) => console.error("toggleLike failed:", err),
  });

  if (!token) {
    return (
      <span>
        ♥ {count} · <Link to="/login">Log in to like</Link>
      </span>
    );
  }

  return (
    <button
      disabled={loading}
      onClick={() => toggleLike()}
      className={`like-button ${liked ? "liked" : ""}`}
    >
      {liked ? "♥" : "♡"} {count}
    </button>
  );
}

LikeButton.propTypes = {
  postId: PropTypes.string.isRequired,
  initialLiked: PropTypes.bool,
  initialCount: PropTypes.number,
};
