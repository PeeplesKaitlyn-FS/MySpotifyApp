const express = require('express');
const router = express.Router();
const axios = require('axios');

console.log('Loading playlists.js');

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
    const playlists = await getPlaylistsFromSpotify(req.session.accessToken);
    console.log('Playlists:', playlists);
    res.send(`
      <h1>Playlists</h1>
      <ul>
        ${playlists.map(playlist => `<li>${playlist.name}</li>`).join('')}
      </ul>
    `);
  } catch (error) {
    console.error('Error getting playlists:', error);
    res.status(500).send('Failed to get playlists');
  }
});

const getPlaylistsFromSpotify = async (accessToken) => {
  const playlists = [];
  let url = 'https://api.spotify.com/v1/me/playlists?limit=50';

  while (true) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    playlists.push(...response.data.items);
    url = response.data.next;
    if (!url) {
      break;
    }
  }
  return playlists;
};
module.exports = router;