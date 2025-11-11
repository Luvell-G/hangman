# Hangman Game

This project is a simple and interactive **Hangman Game** built using **React**.  
Players must guess letters to reveal the hidden word before the hangman is fully drawn.  
It features:

- Dynamic hangman images based on incorrect guesses  
- Search bar for letter input  
- Alphabet buttons that change color based on correct or wrong guesses  
- Win/Loss alerts and automatic game reset  

---

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open **http://localhost:3000** to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.


---

### `npm test`

Launches the test runner in interactive watch mode.  
Automatically detect and run test files such as HangmanGame.test.js

Watch for changes and rerun affected tests

Display pass/fail output for each test
The tests check:

Proper rendering of the HangmanGame component

Letter input behavior (correct vs incorrect guesses)

Lives counter updates

Game over and win alerts

Reset functionality of the “New Game” button
---

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for best performance.

The build is minified and the filenames include hashes.  
**Your app is ready to be deployed!**

---

## How to Play

1. Click **New Game** to start.
2. Guess letters using the **input field** or click buttons.
3. Correct guesses will **reveal letters** in the word.
4. Incorrect guesses will **draw more of the hangman**.
5. Win by revealing all letters — lose if the hangman is fully drawn!

---

## Project Structure

