import { describe, test, expect, type Mock, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Track from './Track';

describe('Track Component', () => {
  // mock props
  const mockTrack = {
    id: 1,
    name: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
  };

  test('renders without crashing', () => {
    render(
      <Track
        track={mockTrack}
        onAdd={() => {}}
      />
    );
  });

  test('displays track information correctly', () => {
    render(
      <Track
        track={mockTrack}
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
        onAdd={onAddMock}
      />
    );
    const addButton = screen.getByRole('button', { name: /\+/i });
    addButton.click();
    expect(addButton).toBeDisabled();
    expect(onAddMock).not.toHaveBeenCalled();
  });
});
