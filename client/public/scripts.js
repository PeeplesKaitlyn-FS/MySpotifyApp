const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const authUrl = 'https://accounts.spotify.com/api/token';
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const authHeaders = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
  });

  const authBody = new URLSearchParams({
    grant_type: 'client_credentials',
  });

  fetch(authUrl, {
    method: 'POST',
    headers: authHeaders,
    body: authBody,
  })
  .then((response) => response.json())
  .then((data) => {
    const accessToken = data.access_token;
    console.log(`Access Token: ${accessToken}`);
  })
  .catch((error) => console.error(error));
});

const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchQuery = document.getElementById('search-query').value;

  const accessToken = getAccessToken();

  const searchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=artist`;
  const searchHeaders = new Headers({
    'Authorization': `Bearer ${accessToken}`,
  });

  fetch(searchUrl, {
    method: 'GET',
    headers: searchHeaders,
  })
  .then((response) => response.json())
  .then((data) => {
    const artists = data.artists.items;
    console.log(artists);
  })
  .catch((error) => console.error(error));
});

function getAccessToken() {
  return 'your_access_token_here';
}