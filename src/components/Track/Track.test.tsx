import { describe, test, expect, type Mock, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Track from './Track';
import type { TrackData } from '../../types';

describe('Track Component', () => {
  const mockTrack = {
    id: '1',
    name: 'Test Track',
    artists: [{ name: 'Test Artist' }],
    album: {
      name: 'Test Album',
      images: [{ url: 'https://example.com/image.jpg' }],
    },
    uri: 'spotify:track:1',
    external_urls: { spotify: 'https://open.spotify.com/track/1' },
  } as TrackData;

  test('renders without crashing', () => {
    render(
      <Track
        track={mockTrack}
        isPlaylist={false}
        onAdd={() => {}}
      />
    );
  });

  test('displays track information correctly', () => {
    render(
      <Track
        track={mockTrack}
        isPlaylist={false}
        onAdd={() => {}}
      />
    );
    const trackName = screen.getByText(/test track/i);
    const trackArtist = screen.getByText(/test artist/i);
    const trackAlbum = screen.getByText(/test album/i);
    expect(trackName).toBeInTheDocument();
    expect(trackArtist).toBeInTheDocument();
    expect(trackAlbum).toBeInTheDocument();
  });
  test('calls onAdd prop when Add button is clicked', () => {
    const onAddMock: Mock = vi.fn();
    render(
      <Track
        track={mockTrack}
        isPlaylist={false}
        onAdd={onAddMock}
      />
    );
    const addButton = screen.getByRole('button', { name: /\+/i });
    addButton.click();
    expect(onAddMock).toHaveBeenCalledWith(mockTrack);
  });

  test('disables Add button if track is already added', () => {
    const addedTrack = { ...mockTrack, isAdded: true };
    const onAddMock: Mock = vi.fn();
    render(
      <Track
        track={addedTrack}
        isPlaylist={false}
        onAdd={onAddMock}
      />
    );
    const addButton = screen.getByRole('button', { name: /\+/i });
    addButton.click();
    expect(addButton).toBeDisabled();
    expect(onAddMock).not.toHaveBeenCalled();
  });
});
