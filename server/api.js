const express = require('express');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.get('/api/test', (req, res) => {
  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
  const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  res.send(`Spotify Client ID: ${spotifyClientId}, Spotify Client Secret: ${spotifyClientSecret}`);
});

module.exports = app;