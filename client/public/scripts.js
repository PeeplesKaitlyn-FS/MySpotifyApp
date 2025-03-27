const loginForm = document.getElementById('login-form');
const searchForm = document.getElementById('search-form');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const redirectUri = 'http://localhost:3000/callback'; 
const scopes = 'user-read-playback-state user-modify-playback-state';
const state = 'some_state'; 

const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}&response_type=code`;

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  window.location.href = authorizeUrl;
});


const callbackUrl = '/callback';


const handleCallback = async (event) => {
  event.preventDefault();
  const code = new URLSearchParams(window.location.search).get('code');
  const state = new URLSearchParams(window.location.search).get('state');

  if (state !== 'some_state') {
    console.error('Invalid state');
    return;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
      }),
    });
    const data = await response.json();
    const accessToken = data.access_token;

    const userDataUrl = 'https://api.spotify.com/v1/me';
    const userDataResponse = await fetch(userDataUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData = await userDataResponse.json();
    console.log(userData);
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener('load', () => {
  if (window.location.pathname === callbackUrl) {
    handleCallback();
  }
});