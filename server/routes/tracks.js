// tracks.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/tracks', async (req, res) => {
  const accessToken = req.session.accessToken;
  const tracksFromSpotify = await getTracksFromSpotify(accessToken);
  res.json(tracksFromSpotify);
});

const getTracksFromSpotify = async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

module.exports = { router, getTracksFromSpotify };