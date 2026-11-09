import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import { useQuery as useGraphQLQuery } from "@apollo/client/react/index.js";
import { Header } from "../components/Header.jsx";
import { Post } from "../components/Post.jsx";
import { GET_POST_BY_ID } from "../api/graphql/posts.js";
import { PostStats } from "../components/PostStats.jsx";
import { useEffect, useState } from "react";
import { postTrackEvent } from "../api/events.js";
import { Helmet } from "react-helmet-async";

export function ViewPost({ postId }) {
  const [session, setSession] = useState();
  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  });
  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate("startView");
      timeout = null;
    }, 1000);
    return () => {
      if (timeout) clearTimeout(timeout);
      else trackEventMutation.mutate("endView");
    };
  }, []);

  const postQuery = useGraphQLQuery(GET_POST_BY_ID, {
    variables: { id: postId },
  });
  const post = postQuery.data?.postById;

  function truncate(str, max = 160) {
    if (!str) return str;
    if (str.length > max) {
      return str.slice(0, max - 3) + "...";
    } else {
      return str;
    }
  }
  return (
    <div style={{ padding: 8 }}>
      {post && (
        <Helmet>
          <title>{post.title} | Full-Stack React Blog</title>
          <meta name="description" content={truncate(post.contents)} />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={post.title} />
          <meta property="og:article:published_time" content={post.createdAt} />
          <meta property="og:article:modified_time" content={post.updatedAt} />
          <meta property="og:article:author" content={post.author?.username} />
          {(post.tags ?? []).map((tag) => (
            <meta key={tag} property="og:article:tag" content={tag} />
          ))}
        </Helmet>
      )}
      <Header />
      <br />
      <hr />
      <Link to="/">Back to main page</Link>
      <br />
      <hr />
      {postQuery.loading ? (
        "Loading..."
      ) : post ? (
        <div>
          <Post {...post} fullPost /> <hr />
          <PostStats postId={postId} />
        </div>
      ) : (
        `Post with id ${postId} not found.`
      )}
    </div>
  );
}
ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
};
