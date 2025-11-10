import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpotifyLoginButton from './SpotifyLoginButton';

describe('SpotifyLoginButton', () => {
  const mockOnTokenChange = vi.fn();
  const mockHandleSetUserData = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockOnTokenChange.mockClear();
    mockHandleSetUserData.mockClear();
    vi.clearAllMocks();
    window.history.replaceState({}, '', window.location.pathname);
  });

  it('should mount without crashing', () => {
    render(
      <SpotifyLoginButton
        isAuthenticated={false}
        handleSetUserData={mockHandleSetUserData}
        onTokenChange={mockOnTokenChange}
      />
    );
  });

  it('should render login button when not authenticated', async () => {
    render(
      <SpotifyLoginButton
        isAuthenticated={false}
        handleSetUserData={mockHandleSetUserData}
        onTokenChange={mockOnTokenChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Login');
    });

    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.getByAltText('spotify Logo')).toBeInTheDocument();
  });

  it('should render logout button when authenticated', () => {
    render(
      <SpotifyLoginButton
        isAuthenticated={true}
        handleSetUserData={mockHandleSetUserData}
        onTokenChange={mockOnTokenChange}
      />
    );

    expect(screen.getByRole('button')).toHaveTextContent('Logout');
  });

  it('should call onTokenChange with null when logout is clicked', async () => {
    const user = userEvent.setup();

    render(
      <SpotifyLoginButton
        isAuthenticated={true}
        handleSetUserData={mockHandleSetUserData}
        onTokenChange={mockOnTokenChange}
      />
    );

    await user.click(screen.getByRole('button'));

    expect(mockOnTokenChange).toHaveBeenCalledWith(null);
    expect(localStorage.getItem('spotify_access_token')).toBeNull();
    expect(localStorage.getItem('spotify_token_expiry')).toBeNull();
    expect(localStorage.getItem('code_verifier')).toBeNull();
  });

  it('should redirect to Spotify auth when login button is clicked', async () => {
    const user = userEvent.setup();

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    render(
      <SpotifyLoginButton
        isAuthenticated={false}
        handleSetUserData={mockHandleSetUserData}
        onTokenChange={mockOnTokenChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Login');
    });

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(localStorage.getItem('code_verifier')).not.toBeNull();
    });
  });

  it('should handle token exchange when code is in URL', async () => {
    const mockCode = 'test-auth-code';
    const mockCodeVerifier = 'test-code-verifier';
    localStorage.setItem('code_verifier', mockCodeVerifier);

    Object.defineProperty(window, 'location', {
      value: {
        search: `?code=${mockCode}`,
        pathname: '/test',
      },
      writable: true,
      configurable: true,
    });

    const mockToken = 'mock-access-token';
    const mockExpiresIn = 3600;
    const mockUserData = { id: 'user123', display_name: 'Test User' };

    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({
          access_token: mockToken,
          expires_in: mockExpiresIn,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData,
      });

    window.history.replaceState = vi.fn();

    render(
      <SpotifyLoginButton
        isAuthenticated={false}
        handleSetUserData={mockHandleSetUserData}
        onTokenChange={mockOnTokenChange}
      />
    );

    await waitFor(() => {
      expect(mockOnTokenChange).toHaveBeenCalledWith(mockToken);
    });

    expect(localStorage.getItem('spotify_access_token')).toBe(mockToken);
    expect(localStorage.getItem('code_verifier')).toBeNull();
    expect(window.history.replaceState).toHaveBeenCalled();
  });

  it('should handle token exchange error', async () => {
    const mockCode = 'test-auth-code';
    const mockCodeVerifier = 'test-code-verifier';
    localStorage.setItem('code_verifier', mockCodeVerifier);

    Object.defineProperty(window, 'location', {
      value: {
        search: `?code=${mockCode}`,
        pathname: '/',
      },
      writable: true,
      configurable: true,
    });

    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error('Token exchange failed'));

    render(
      <SpotifyLoginButton
        isAuthenticated={false}
        handleSetUserData={mockHandleSetUserData}
        onTokenChange={mockOnTokenChange}
      />
    );

    await waitFor(() => {
      expect(mockOnTokenChange).toHaveBeenCalledWith(null);
    });

    expect(localStorage.getItem('spotify_access_token')).toBeNull();
  });
});
