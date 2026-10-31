import PropTypes from "prop-types";
import { User } from "./User.jsx";
import { Link } from "react-router-dom";
import slug from "slug";

export function Post({
  title,
  contents,
  imageUrl,
  author,
  id,
  fullPost = false,
}) {
  return (
    <article className="post">
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}

      {/* Correctly combined condition wrapping both elements safely */}
      {fullPost && (
        <>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="recipe-image"
              referrerPolicy="no-referrer"
            />
          )}
          <div>{contents}</div>
        </>
      )}

      {author && (
        <em>
          {fullPost && <br />}
          Written by <User {...author} />
        </em>
      )}
    </article>
  );
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  imageUrl: PropTypes.string,
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
};
