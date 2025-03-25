const express = require('express');
const router = express.Router();
const axios = require('axios');

console.log('Loading tracks.js');

router.get('/callback', async (req, res) => {
  console.log('Rendering /callback route');
  const code = req.query.code;
  const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', {
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://localhost:3000/callback',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const accessToken = tokenResponse.data.access_token;
  req.session.accessToken = accessToken;

  res.redirect('/');
});

router.get('/', async (req, res) => {
  if (!req.session.accessToken) {
    return res.redirect('/callback');
  }

  console.log('Rendering / route');
  console.log('accessToken:', req.session.accessToken);
  try {
    const tracks = await getTracksFromSpotify(req.session.accessToken);
    console.log('Tracks:', tracks);
    res.send(`
      <h1>Tracks</h1>
      <ul>
        ${tracks.map(track => `<li>${track.track.name} by ${track.track.artists[0].name}</li>`).join('')}
      </ul>
    `);
  } catch (error) {
    console.error('Error getting tracks:', error);
    res.status(500).send('Failed to get tracks');
  }
});

const getTracksFromSpotify = async (accessToken) => {
  const tracks = [];
  let url = 'https://api.spotify.com/v1/me/tracks?limit=50';

  while (true) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    tracks.push(...response.data.items);
    url = response.data.next;
    if (!url) {
      break;
    }
  }
  return tracks;
};
module.exports = router;