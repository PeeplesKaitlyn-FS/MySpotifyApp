// Login.js
import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = '/auth/spotify';
  };

  return (
    <div>
      <h1>Spotify Web API</h1>
      <p>In order to use this app you must be logged in!</p>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;