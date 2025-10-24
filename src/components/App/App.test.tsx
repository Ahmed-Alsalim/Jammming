import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
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
