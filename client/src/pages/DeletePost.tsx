import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeletePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const response = await fetch(`http://localhost:8000/post/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    if (response.ok) {
        navigate('/')
    } else {
        const { message } = await response.json()
        setError(message)
    }
  }

  return (
    <>
        {error && <p style={{ color: "red"}}>{error}</p>}
        <button style={{ marginTop: '10px'}} onClick={handleDelete}>Delete Post</button>
    </>
  )
};

export default DeletePost;
