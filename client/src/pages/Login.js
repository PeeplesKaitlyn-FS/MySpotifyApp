import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setAccessToken(storedToken);
    } else {
      navigate('/login');
    }
  }, []);

  const handleLogin = () => {
    const clientId = 'your_client_id';
    const scope = 'user-read-private user-read-email';
    const redirectUri = 'http://localhost:3000/callback';
    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = url;
  };

  return (
    <div>
      <h1>Music Search App</h1>
      <p>In order to use this app you must be logged in!</p>
      <form id="login-form">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username"/><br />
        <label for="password">Password:</label>
        <input type="password" id="password" name="password"/><br />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;