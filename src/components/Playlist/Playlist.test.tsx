import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Playlist from './Playlist';
import { act } from 'react';
import { spotifyFetch } from '../../utils/FetchHelper';
import type { TrackData } from '../../types';

vi.mock('../../utils/FetchHelper', () => ({
  spotifyFetch: vi.fn(),
}));

describe('Playlist Component', () => {
  const mockTracks: TrackData[] = [
    {
      id: '1',
      name: 'Song 1',
      artists: [{ name: 'Artist 1' }],
      album: {
        name: 'Album 1',
        images: [{ url: 'https://example.com/image1.jpg' }],
      },
      uri: 'spotify:track:1',
    } as TrackData,
    {
      id: '2',
      name: 'Song 2',
      artists: [{ name: 'Artist 2' }],
      album: {
        name: 'Album 2',
        images: [{ url: 'https://example.com/image2.jpg' }],
      },
      uri: 'spotify:track:2',
    } as TrackData,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function fillTitleInput(title: string) {
    const titleInput = screen.getByPlaceholderText(/enter playlist name/i);
    act(() => {
      titleInput.focus();
      titleInput.setAttribute('value', title);
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  test('renders without crashing', () => {
    render(
      <Playlist
        playlistTracks={mockTracks}
        onRemoveTrack={vi.fn()}
      />
    );
  });

  test('displays playlist title field', () => {
    render(
      <Playlist
        playlistTracks={mockTracks}
        onRemoveTrack={vi.fn()}
      />
    );
    const title = screen.getByPlaceholderText(/enter playlist name/i);
    expect(title).toBeInTheDocument();
  });

  test('contains Tracklist component', () => {
    render(
      <Playlist
        playlistTracks={mockTracks}
        onRemoveTrack={vi.fn()}
      />
    );
    const tracklist = screen.getByTestId('tracklist');
    expect(tracklist).toBeInTheDocument();
  });

  test('disables Save button while saving', async () => {
    vi.mocked(spotifyFetch)
      .mockResolvedValueOnce({ id: 'playlist-123' })
      .mockResolvedValueOnce({ snapshot_id: 'snapshot-123' });

    render(
      <Playlist
        playlistTracks={mockTracks}
        userId='user123'
        onRemoveTrack={vi.fn()}
      />
    );

    fillTitleInput('My Playlist');

    const saveButton: HTMLButtonElement = screen.getByRole('button', {
      name: /save to spotify/i,
    });

    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent('Save to Spotify');

    act(() => {
      saveButton.click();
    });

    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent('Saving...');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent('Save to Spotify');
  });

  test('shows success message when playlist is saved', async () => {
    vi.mocked(spotifyFetch)
      .mockResolvedValueOnce({ id: 'playlist-123' })
      .mockResolvedValueOnce({ snapshot_id: 'snapshot-123' });

    render(
      <Playlist
        playlistTracks={mockTracks}
        userId='user123'
        onRemoveTrack={vi.fn()}
      />
    );

    fillTitleInput('My Playlist');

    const saveButton: HTMLButtonElement = screen.getByRole('button', {
      name: /save to spotify/i,
    });

    act(() => {
      saveButton.click();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(
      screen.getByText(/playlist saved successfully!/i)
    ).toBeInTheDocument();
  });

  test('shows error message when no title is provided', async () => {
    render(
      <Playlist
        playlistTracks={mockTracks}
        onRemoveTrack={vi.fn()}
      />
    );
    const saveButton: HTMLButtonElement = screen.getByRole('button', {
      name: /save to spotify/i,
    });
    act(() => {
      saveButton.click();
    });

    expect(
      screen.getByText(/Please enter a playlist title/i)
    ).toBeInTheDocument();
  });

  test('shows error message when no tracks are in the playlist', async () => {
    render(
      <Playlist
        playlistTracks={[]}
        onRemoveTrack={vi.fn()}
      />
    );
    fillTitleInput('My Playlist');

    const saveButton: HTMLButtonElement = screen.getByRole('button', {
      name: /save to spotify/i,
    });
    act(() => {
      saveButton.click();
    });
    expect(
      screen.getByText(/Please add at least one track to the playlist/i)
    ).toBeInTheDocument();
  });
});
