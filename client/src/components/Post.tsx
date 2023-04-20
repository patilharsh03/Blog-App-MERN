import { format } from 'date-fns'

export interface PostProps {
  title: string;
  summary: string;
  content: string;
  cover: string;
  createdAt: string;
  author: string,
}

const Post = ({title, summary, content, cover, createdAt, author}: PostProps) => {
  return (
    <div className="post">
        <div className="image">
        <img
          src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*rOftVsTH3B3R-ZaxNfvQfA.png"
          alt="logo"
        />
        </div>
        <div className="texts">
          <h2>{title}</h2>
          <p className="info">
            <a className="author">{author.username}</a>
            <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
          </p>
          <p className="summary">
            {summary}
          </p>
        </div>
      </div>
  )
}

export default Post