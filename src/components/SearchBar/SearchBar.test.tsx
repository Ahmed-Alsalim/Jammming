import { describe, test, expect, vi, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  test('renders without crashing', () => {
    render(<SearchBar />);
  });

  test('contains input field with placeholder "Enter A Song, Album, or Artist"', () => {
    render(<SearchBar />);
    const inputField: HTMLInputElement = screen.getByRole('textbox');
    expect(inputField).toBeInTheDocument();
    expect(inputField).toHaveAttribute(
      'placeholder',
      'Enter A Song, Album, or Artist'
    );
  });

  test('contains Search button', () => {
    render(<SearchBar />);
    const searchButton: HTMLButtonElement = screen.getByRole('button', {
      name: /search/i,
    });
    expect(searchButton).toBeInTheDocument();
  });

  test('input field updates value state on change', () => {
    render(<SearchBar />);
    const inputField: HTMLInputElement = screen.getByRole('textbox');
    expect(inputField.value).toBe('');
    fireEvent.change(inputField, { target: { value: 'New Song' } });
    expect(inputField.value).toBe('New Song');
  });

  test('calls onSearch prop when Search button is clicked', () => {
    const onSearchMock: Mock = vi.fn();
    render(<SearchBar onSearch={onSearchMock} />);
    const searchButton: HTMLButtonElement = screen.getByRole('button', {
      name: /search/i,
    });
    fireEvent.click(searchButton);
    expect(onSearchMock).toHaveBeenCalled();
  });
});
