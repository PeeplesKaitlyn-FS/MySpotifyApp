import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      fetch(`https://accounts.spotify.com/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/callback`,
      })
        .then(response => response.json())
        .then(data => {
          const token = data.access_token;
          localStorage.setItem('access_token', token);
          setAccessToken(token);
          navigate('/');
        })
        .catch(error => console.error(error));
    }
  }, []);

  return <div>Loading...</div>;
};

export default Callback;