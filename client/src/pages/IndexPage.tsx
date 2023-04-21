import { useEffect, useState } from "react"
import Post from "../components/Post"
import { PostProps } from "../components/Post"

const IndexPage = () => {
  const [posts, setPosts] = useState<PostProps[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/post').then(response => {
      response.json().then(posts => {
        setPosts(posts)
      })
    })
  }, [])
  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post key={post._id} {...post}  />
      ))}
    </>
  )
}

export default IndexPage