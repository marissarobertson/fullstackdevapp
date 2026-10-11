import PropTypes from "prop-types";
import { User } from "./User.jsx";

export function Post({ title, contents, author }) {
  return (
    <article className="post">
      <h3 className="post-title">{title}</h3>
      <div className="post-content">{contents}</div>
      {author && (
        <em className="post-author">
          <br />
          Written by <User id={author} />
        </em>
      )}
    </article>
  );
}
Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
};
