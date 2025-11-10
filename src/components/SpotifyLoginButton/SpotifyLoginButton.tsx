import './SpotifyLoginButton.css';
import { spotifyFetch } from '../../utils/FetchHelper';
import { useEffect, useState, useRef } from 'react';
import type { User } from '../../types';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES =
  'playlist-modify-public playlist-modify-private user-read-private';

function generateRandomString(length: number): string {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

interface SpotifyLoginButtonProps {
  isAuthenticated: boolean;
  handleSetUserData: (user: User | null) => void;
  onTokenChange: (token: string | null) => void;
}

function SpotifyLoginButton({
  isAuthenticated,
  handleSetUserData,
  onTokenChange,
}: SpotifyLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const tokenRequestInitiated = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      setIsLoading(false);
      return;
    }

    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      console.error('SpotifyLoginButton: Code verifier not found');
      setIsLoading(false);
      return;
    }

    if (tokenRequestInitiated.current) return;
    tokenRequestInitiated.current = true;

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    })
      .then((res) => res.json())
      .then(({ access_token, expires_in }) => {
        const expiryTime = (Date.now() + expires_in * 1000).toString();
        localStorage.removeItem('code_verifier');
        localStorage.setItem('spotify_access_token', access_token);
        localStorage.setItem('spotify_token_expiry', expiryTime);

        onTokenChange(access_token);

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        spotifyFetch('/me', {
          method: 'GET',
        }).then((data: User) => {
          handleSetUserData(data);
        });
      })
      .catch(() => {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_token_expiry');
        onTokenChange(null);
        handleSetUserData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [handleSetUserData, isAuthenticated, onTokenChange]);

  const handleLogin = async () => {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem('code_verifier', codeVerifier);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.search = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    }).toString();

    window.location.href = authUrl.toString();
  };

  const handleLogout = () => {
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');

    onTokenChange(null);
    handleSetUserData(null);
  };

  if (isAuthenticated) {
    return (
      <button
        className='auth-button logout-button'
        onClick={handleLogout}
      >
        Logout
      </button>
    );
  }

  return (
    <button
      disabled={isLoading}
      className='auth-button login-button'
      onClick={handleLogin}
    >
      <img
        src='/assets/spotify.svg'
        alt='spotify Logo'
        className='spotify-logo'
      />
      <span>Login</span>
    </button>
  );
}

export default SpotifyLoginButton;
