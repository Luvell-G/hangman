test('correct guess does not reduce lives', () => {
  // Mock Math.random to always pick the first word ("Morehouse")
  jest.spyOn(global.Math, 'random').mockReturnValue(0);

  render(<HangmanGame />);
  fireEvent.click(screen.getByText(/New Game/i));

  const livesBefore = screen.getByText(/Lives Left:/i).textContent;

  // "Morehouse" starts with M, so this is always a correct guess
  fireEvent.click(screen.getByText('M'));

  const livesAfter = screen.getByText(/Lives Left:/i).textContent;

  expect(livesAfter).toBe(livesBefore);

  // Restore Math.random after test
  jest.spyOn(global.Math, 'random').mockRestore();
});
