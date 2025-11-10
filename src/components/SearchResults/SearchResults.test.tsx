import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchResults from './SearchResults';
import { act } from 'react';
import { spotifyFetch } from '../../utils/FetchHelper';

vi.mock('../../utils/FetchHelper', () => ({
  spotifyFetch: vi.fn(),
}));

describe('SearchResults Component', () => {
  const mockResults = [
    {
      id: '1',
      name: 'Song A',
      artists: [{ name: 'Artist A' }],
      album: {
        name: 'Album A',
        images: [{ url: 'https://example.com/imageA.jpg' }],
      },
      uri: 'spotify:track:1',
    },
    {
      id: '2',
      name: 'Song B',
      artists: [{ name: 'Artist B' }],
      album: {
        name: 'Album B',
        images: [{ url: 'https://example.com/imageB.jpg' }],
      },
      uri: 'spotify:track:2',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(
      <SearchResults
        addedTracks={[]}
        onAddTrack={() => {}}
        searchTerm={''}
      />
    );
  });

  test('fetches and displays search results', async () => {
    vi.mocked(spotifyFetch).mockResolvedValueOnce({
      tracks: { items: mockResults },
    });

    render(
      <SearchResults
        addedTracks={[]}
        onAddTrack={() => {}}
        searchTerm={'test'}
      />
    );

    expect(spotifyFetch).toHaveBeenCalledWith(
      expect.stringContaining('/search?type=track&q='),
      expect.any(Object)
    );
  });

  test('handles empty search results', async () => {
    vi.mocked(spotifyFetch).mockResolvedValueOnce({
      tracks: { items: [] },
    });

    render(
      <SearchResults
        addedTracks={[]}
        onAddTrack={() => {}}
        searchTerm={'no results'}
      />
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const resultsContainer: HTMLDivElement =
      screen.getByTestId('search-results');
    expect(resultsContainer).toBeInTheDocument();
    expect(resultsContainer.textContent).toContain('No results found');
  });

  test('handles fetch error', async () => {
    vi.mocked(spotifyFetch).mockRejectedValueOnce(new Error('Fetch error'));

    render(
      <SearchResults
        addedTracks={[]}
        onAddTrack={() => {}}
        searchTerm={'test'}
      />
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const resultsContainer: HTMLDivElement =
      screen.getByTestId('search-results');
    expect(resultsContainer).toBeInTheDocument();
    expect(screen.getByText(/Error fetching results/i)).toBeInTheDocument();
  });

  test('handles no search term', () => {
    render(
      <SearchResults
        addedTracks={[]}
        onAddTrack={() => {}}
        searchTerm={''}
      />
    );
    const resultsContainer: HTMLDivElement =
      screen.getByTestId('search-results');
    expect(resultsContainer).toBeInTheDocument();
    expect(screen.queryByText(/No results found/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Error fetching results/i)
    ).not.toBeInTheDocument();
  });

  test('displays list of search results', async () => {
    vi.mocked(spotifyFetch).mockResolvedValueOnce({
      tracks: { items: mockResults },
    });

    render(
      <SearchResults
        addedTracks={[]}
        onAddTrack={() => {}}
        searchTerm={'test'}
      />
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const resultsContainer: HTMLDivElement =
      screen.getByTestId('search-results');
    expect(resultsContainer).toBeInTheDocument();
  });
});
