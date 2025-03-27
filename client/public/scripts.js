const loginForm = document.getElementById('login-form');
const searchForm = document.getElementById('search-form');

const authUrl = 'https://accounts.spotify.com/api/token';
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const getAuthHeaders = () => {
  const authHeaders = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
  });
  return authHeaders;
};

const getAccessToken = async () => {
  const response = await fetch(authUrl, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });
  const data = await response.json();
  return data.access_token;
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: new URLSearchParams({
        grant_type: 'password',
        username,
        password,
      }),
    });
    const data = await response.json();
    const accessToken = data.access_token;
    console.log(`Access Token: ${accessToken}`);
  } catch (error) {
    console.error(error);
  }
});

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchQuery = document.getElementById('search-query').value;

  try {
    const accessToken = await getAccessToken();
    const searchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=artist`;
    const searchHeaders = new Headers({
      'Authorization': `Bearer ${accessToken}`,
    });

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: searchHeaders,
    });
    const data = await response.json();
    const artists = data.artists.items;
    console.log(artists);
  } catch (error) {
    console.error(error);
  }
});