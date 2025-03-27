import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setAccessToken(data.accessToken);
      navigate('/callback');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Music Search App</h1>
      <p>In order to use this app you must be logged in!</p>
      <form onSubmit={handleLogin}>
        <label for="username">Username:</label>
        <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} /><br />
        <label for="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} /><br />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/callback')}>Login with Spotify</button>
    </div>
  );
};

export default Login;