import React, { useState } from 'react';

const Login = () => {
  const handleLogin = () => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = encodeURIComponent('http://localhost:3000/callback');
    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';
    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    window.location.href = url;
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