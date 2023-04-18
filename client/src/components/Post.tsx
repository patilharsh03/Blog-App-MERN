const Post = () => {
  return (
    <div className="post">
        <div className="image">
        <img
          src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*rOftVsTH3B3R-ZaxNfvQfA.png"
          alt="logo"
        />
        </div>
        <div className="texts">
          <h2>What We’re Reading: Aren’t humans amazing sometimes?</h2>
          <p className="info">
            <a className="author">Harsh Patil</a>
            <time>2023-04-17 13:50</time>
          </p>
          <p className="summary">
            Humans are amazing sometimes. In the midst of *gestures broadly*
            everything happening in the world right now, it’s worth coming back
            to this simple truth from time to time, and I wanted to share two
            stories from Medium this week that illustrate the point in two very
            different ways.
          </p>
        </div>
      </div>
  )
}

export default Post