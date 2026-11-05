import { useQuery } from "@apollo/client/react/index.js";
import { Link } from "react-router-dom";
import slug from "slug";
import { GET_TOP_POSTS } from "../api/graphql/posts.js";

export function TopPosts() {
  const { data } = useQuery(GET_TOP_POSTS, { variables: { limit: 5 } });
  const posts = data?.topPosts ?? [];
  if (posts.length === 0) return null;
  return (
    <section>
      <h2>Top Recipes</h2>
      <ol>
        {posts.map((p) => (
          <li key={p.id}>
            <Link to={`/posts/${p.id}/${slug(p.title)}`}>{p.title}</Link> ♥{" "}
            {p.likeCount}
          </li>
        ))}
      </ol>
    </section>
  );
}
