import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
//import SearchBar from './pages/SearchBar';
import Dashboard from './components/Dashboard';

const AuthSpotify = () => {
  useEffect(() => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-private%20user-read-email`;
  }, []);

  return <div>Redirecting to Spotify...</div>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<Login />} />
        <Route path="/auth/spotify" element={<AuthSpotify />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;