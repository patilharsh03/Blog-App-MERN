import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const {setUserInfo, userInfo} = useContext(UserContext)

  useEffect(() => {
    // fetch("http://localhost:8000/profile", {
    fetch("https://blog-app-backend-vxel.onrender.com/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {  
        setUserInfo(userInfo)
      });
    });
  }, []);

  function logout() {
    // fetch('http://localhost:8000/logout', {
    fetch('https://blog-app-backend-vxel.onrender.com/logout', {
      credentials: 'include',
      method: 'POST'
    })
    setUserInfo(null)
  }

  const username = userInfo?.username

  return (
    <header>
      <Link to="/" className="logo">
        My Blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
