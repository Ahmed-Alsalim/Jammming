import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    const mockToken = 'mock-access-token';
    const mockExpiry = (Date.now() + 3600000).toString();

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      if (key === 'spotify_access_token') return mockToken;
      if (key === 'spotify_token_expiry') return mockExpiry;
      return null;
    });
  });

  test('renders without crashing', () => {
    render(<App />);
  });

  test('renders main title "Jammming"', () => {
    render(<App />);
    const title = screen.getByText(/jammming/i);
    expect(title).toBeInTheDocument();
  });

  test('contains SearchBar component', () => {
    render(<App />);
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toBeInTheDocument();
  });

  test('contains SearchResults component', () => {
    render(<App />);
    const searchResults = screen.getByTestId('search-results');
    expect(searchResults).toBeInTheDocument();
  });

  test('contains Playlist component', () => {
    render(<App />);
    const playlist = screen.getByTestId('playlist');
    expect(playlist).toBeInTheDocument();
  });
});
