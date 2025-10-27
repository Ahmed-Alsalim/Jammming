import { describe, test, expect, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchResults from './SearchResults';

describe('SearchResults Component', () => {
  test('renders without crashing', () => {
    render(<SearchResults />);
  });

  test('fetches and displays search results', async () => {
    const mockResults = [
      { id: 1, name: 'Song A', artist: 'Artist A', album: 'Album A' },
      { id: 2, name: 'Song B', artist: 'Artist B', album: 'Album B' },
    ];

    (globalThis.fetch as Mock).mockResolvedValueOnce({
      json: async () => ({ results: mockResults }),
    });
    render(<SearchResults />);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/search?query=')
    );
  });

  test('handles empty search results', () => {
    render(<SearchResults />);
    const resultsContainer: HTMLDivElement =
      screen.getByTestId('search-results');
    expect(resultsContainer).toBeInTheDocument();
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  test('handles fetch error', () => {
    render(<SearchResults />);
    const resultsContainer: HTMLDivElement =
      screen.getByTestId('search-results');
    expect(resultsContainer).toBeInTheDocument();
    expect(screen.getByText(/Error fetching results/i)).toBeInTheDocument();
  });

  test('handles no search term', () => {
    render(<SearchResults />);
    const resultsContainer: HTMLDivElement =
      screen.getByTestId('search-results');
    expect(resultsContainer).toBeInTheDocument();
    expect(screen.getByText(/No results found/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Error fetching results/i)).not.toBeInTheDocument();
  });

  test('displays list of search results', () => {
    render(<SearchResults />);
    const resultsContainer: HTMLDivElement =
      screen.getByTestId('search-results');
    expect(resultsContainer).toBeInTheDocument();
  });
});
