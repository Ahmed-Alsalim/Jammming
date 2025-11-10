import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tracklist from './Tracklist';
import type { TrackData } from '../../types';

describe('Tracklist Component', () => {
  const mockTracks: TrackData[] = [
    {
      id: '1',
      name: 'Song A',
      artists: [{ name: 'Artist A' }],
      album: {
        name: 'Album A',
        images: [{ url: 'https://example.com/imageA.jpg' }],
      },
      uri: 'spotify:track:1',
    } as TrackData,
    {
      id: '2',
      name: 'Song B',
      artists: [{ name: 'Artist B' }],
      album: {
        name: 'Album B',
        images: [{ url: 'https://example.com/imageB.jpg' }],
      },
      uri: 'spotify:track:2',
    } as TrackData,
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

  test('handles empty track list', () => {
    render(
      <Tracklist
        isPlaylist
        tracks={[]}
        handleAddTrack={() => {}}
      />
    );
    const tracklistContainer: HTMLDivElement = screen.getByTestId('tracklist');
    expect(tracklistContainer).toBeInTheDocument();
    expect(tracklistContainer).toBeEmptyDOMElement();
  });
});
