const express = require('express');
const router = express.Router();
const axios = require('axios');

console.log('Loading profile.js');

router.get('/callback', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).send('Failed to get access token');
  }
});

router.get('/', async (req, res) => {
  if (!req.session.accessToken) {
    return res.redirect('/callback');
  }

  console.log('Rendering / route');
  console.log('accessToken:', req.session.accessToken);
  try {
    const profile = await getProfileFromSpotify(req.session.accessToken);
    if (!profile) {
      console.error('Error getting profile: profile is null or undefined');
      res.status(500).send('Failed to get profile');
    } else {
      console.log('Profile:', profile);
      res.send(`
        <h1>Profile</h1>
        <p>Username: ${profile.display_name}</p>
        <p>Email: ${profile.email}</p>
      `);
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).send('Failed to get profile');
  }
});

const getProfileFromSpotify = async (accessToken) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting profile from Spotify:', error);
    return null;
  }
};

module.exports = router;