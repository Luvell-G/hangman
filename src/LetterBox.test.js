import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LetterBox from './LetterBox';

describe('LetterBox Component', () => {

  test('renders the letter but hides it when isVisible=false', () => {
    render(<LetterBox letter="A" isVisible={false} />);
    const letterEl = screen.getByText('A');

    expect(letterEl).toBeInTheDocument();
    expect(letterEl).toHaveStyle('visibility: hidden');
  });

  test('shows the letter when isVisible=true', () => {
    render(<LetterBox letter="B" isVisible={true} />);
    const letterEl = screen.getByText('B');

    expect(letterEl).toHaveStyle('visibility: visible');
  });

  test('applies custom boxStyle correctly', () => {
    render(
      <LetterBox
        letter="C"
        isVisible={true}
        boxStyle={{ backgroundColor: 'blue', borderRadius: '10px' }}
      />
    );

    const boxDiv = screen.getByText('C').parentElement;
    expect(boxDiv).toHaveStyle('background-color: blue');
    expect(boxDiv).toHaveStyle('border-radius: 10px');
  });

  test('applies custom letterStyle correctly', () => {
    render(
      <LetterBox
        letter="D"
        isVisible={true}
        letterStyle={{ color: 'red', fontSize: '40px' }}
      />
    );

    const letterEl = screen.getByText('D');
    expect(letterEl).toHaveStyle('color: red');
    expect(letterEl).toHaveStyle('font-size: 40px');
  });

  test('combines default and custom styles', () => {
    render(
      <LetterBox
        letter="E"
        isVisible={true}
        boxStyle={{ width: '100px' }}
        letterStyle={{ color: 'green' }}
      />
    );

    const boxDiv = screen.getByText('E').parentElement;
    const letterEl = screen.getByText('E');

    // Default + custom
    expect(boxDiv).toHaveStyle('width: 100px');
    expect(boxDiv).toHaveStyle('height: 50px'); // from default
    expect(letterEl).toHaveStyle('color: green');
    expect(letterEl).toHaveStyle('visibility: visible');
  });
});
