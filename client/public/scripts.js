const url = 'https://accounts.spotify.com/authorize';
const redirectUri = 'https://localhost:3000/auth/spotify/callback';
const clientId = '4b75d6b58d724cf6b61af5c5afa0d275';
const state = 'some_state';

const params = new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: redirectUri,
  state: state,
  scope: 'user-read-private user-read-email',
});

window.location.href = `${url}?${params.toString()}`;

const handleCallbackUrl = async () => {
  const code = new URLSearchParams(window.location.search).get('code');
  const state = new URLSearchParams(window.location.search).get('state');

  if (state !== 'some_state') {
    console.error('Invalid state');
    return;
  }

  try {
    const response = await fetch('/api/token', {
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
  if (window.location.pathname === '/callback') {
    handleCallbackUrl();
  }
});