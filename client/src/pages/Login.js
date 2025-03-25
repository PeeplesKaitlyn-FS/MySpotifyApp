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
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;