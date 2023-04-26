import React, { useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // const response = await fetch('http://localhost:8000/register', {
    const response = await fetch('https://blog-app-backend-vxel.onrender.com/register', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type': 'application/json'},
    })
    if (response.status === 200) {
      alert('registration successful')
    } else {
      alert('registration failed.')
    }
  } 

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Register</button>
    </form>
  );
};

export default RegisterPage;
