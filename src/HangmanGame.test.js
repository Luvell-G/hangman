import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HangmanGame from './HangmanGame';

// Mock image imports since Jest doesn't handle image files natively
jest.mock('./noose.png', () => 'noose.png');
jest.mock('./upperBody.png', () => 'upperBody.png');
jest.mock('./upperandlowerbody.png', () => 'upperandlowerbody.png');
jest.mock('./1arm.png', () => '1arm.png');
jest.mock('./botharms.png', () => 'botharms.png');
jest.mock('./1leg.png', () => '1leg.png');
jest.mock('./dead.png', () => 'dead.png');

describe('HangmanGame Component', () => {
  test('renders New Game button and Lives Left counter', () => {
    render(<HangmanGame />);
    expect(screen.getByText(/New Game/i)).toBeInTheDocument();
    expect(screen.getByText(/Lives Left:/i)).toBeInTheDocument();
  });

  test('starts a new game and displays underscores for a word', () => {
    render(<HangmanGame />);
    const startButton = screen.getByText(/New Game/i);
    fireEvent.click(startButton);

    const display = screen.getByText(/_/);
    expect(display).toBeInTheDocument();
  });

  test('pressing a letter marks it as used (disabled)', () => {
    render(<HangmanGame />);
    fireEvent.click(screen.getByText(/New Game/i));

    const letterA = screen.getByText('A');
    fireEvent.click(letterA);

    expect(letterA).toBeDisabled();
  });

  test('incorrect guess increases life counter and changes image', () => {
    render(<HangmanGame />);
    fireEvent.click(screen.getByText(/New Game/i));

    const initialImg = screen.getByAltText(/Hangman stage/i);
    const initialSrc = initialImg.getAttribute('src');

    const badGuess = screen.getByText('Z');
    fireEvent.click(badGuess);

    const updatedImg = screen.getByAltText(/Hangman stage/i);
    const updatedSrc = updatedImg.getAttribute('src');

    expect(updatedSrc).not.toBe(initialSrc);
    expect(screen.getByText(/Lives Left:/i)).toHaveTextContent('Lives Left: 5');
  });

  // ✅ FIXED TEST
  test('correct guess does not reduce lives', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0); // Always pick "Morehouse"
    render(<HangmanGame />);
    fireEvent.click(screen.getByText(/New Game/i));

    const livesBefore = screen.getByText(/Lives Left:/i).textContent;

    fireEvent.click(screen.getByText('M')); // Correct letter
    const livesAfter = screen.getByText(/Lives Left:/i).textContent;

    expect(livesAfter).toBe(livesBefore);
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  // ✅ Also make sure Game Over works (with timers)
  test('game over triggers alert when lives reach 6', () => {
    jest.useFakeTimers();
    window.alert = jest.fn();

    render(<HangmanGame />);
    fireEvent.click(screen.getByText(/New Game/i));

    ['Q', 'Z', 'X', 'V', 'J', 'P'].forEach((l) => {
      fireEvent.click(screen.getByText(l));
    });

    jest.runAllTimers();
    expect(window.alert).toHaveBeenCalledWith('Game Over!');
    jest.useRealTimers();
  });
});
