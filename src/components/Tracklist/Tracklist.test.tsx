import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tracklist from './Tracklist';

describe('Tracklist Component', () => {
  const mockTracks = [
    { id: 1, name: 'Song A', artist: 'Artist A', album: 'Album A' },
    { id: 2, name: 'Song B', artist: 'Artist B', album: 'Album B' },
  ];

  test('renders without crashing', () => {
    render(
      <Tracklist
        isPlaylist
        tracks={mockTracks}
        handleAddTrack={() => {}}
      />
    );
  });

  test('displays list of tracks', () => {
    render(
      <Tracklist
        isPlaylist
        tracks={mockTracks}
        handleAddTrack={() => {}}
      />
    );
    const trackNames = mockTracks.map((track) => track.name);
    trackNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  test('handles empty track list message', () => {
    render(
      <Tracklist
        isPlaylist
        tracks={[]}
        handleAddTrack={() => {}}
      />
    );
    const tracklistContainer: HTMLDivElement = screen.getByTestId('tracklist');
    expect(tracklistContainer).toBeInTheDocument();
    expect(screen.getByText(/no tracks available/i)).toBeInTheDocument();
  });
});
