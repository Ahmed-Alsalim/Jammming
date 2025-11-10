const API_BASE_URL = import.meta.env.VITE_SPOTIFY_API_BASE_URL;
let token = localStorage.getItem('spotify_access_token');

function getToken() {
  if (!token) {
    token = localStorage.getItem('spotify_access_token');
  }

  return token;
}

export async function spotifyFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
