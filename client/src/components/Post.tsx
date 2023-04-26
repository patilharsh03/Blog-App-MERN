import { format } from "date-fns";
import { Link } from "react-router-dom";

export interface PostProps {
  title: string;
  _id: string,
  summary: string;
  content: string;
  cover: string;
  createdAt: string;
  author: {
    username: string;
  };
}

const Post = ({
  _id,
  title,
  summary,
  content,
  cover,
  createdAt,
  author,
}: PostProps) => {
  return (
    <div className="post">
      <div className="image">
        <Link to={`post/${_id}`}>
        <img
          // src={`http://localhost:8000/${cover}`}
          src={`https://blog-app-backend-vxel.onrender.com/${cover}`}
          alt="logo"
        />
        </Link>
      </div>
      <div className="texts">
        <Link to={`post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
