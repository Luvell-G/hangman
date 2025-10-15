import React from 'react';
import './App.css';
import LetterBox from './LetterBox';
import SingleLetterSearchBar from './SingleLetterSearchBar';

const pics = ['noose.png', 'upperBody.png', 'upperandlowerbody.png', '1arm.png', 'botharms.png', '1leg.png', 'dead.png'];
const words = ["Morehouse", "Spelman", "Basketball", "Table", "Museum", "Excellent", "Fun", "React"];

class HangmanGame extends React.Component {
  state = {
    wordList: [],
    curWord: 0,
    lifeLeft: 0, 
    usedLetters: [],
    playerName: '',
    correctLetters: []
  };

  componentDidMount() {
    this.setState({ wordList: words });
  }

  startNewGame = () => {
    this.setState({
      curWord: Math.floor(Math.random() * this.state.wordList.length),
      lifeLeft: 0,
      usedLetters: [],
      correctLetters: []
    });
  };

 handleSearch = (letter) => {
  letter = letter.toLowerCase(); 

  const { wordList, curWord, usedLetters, correctLetters } = this.state;
  const word = wordList[curWord]?.toLowerCase() || '';

  if (usedLetters.includes(letter)) return;

  const isCorrect = word.includes(letter);

  this.setState(prevState => ({
    usedLetters: [...prevState.usedLetters, letter],
    correctLetters: isCorrect ? [...prevState.correctLetters, letter] : prevState.correctLetters,
    lifeLeft: !isCorrect ? prevState.lifeLeft + 1 : prevState.lifeLeft
  }), () => {
    this.checkGameStatus();
  });
};


  checkGameStatus = () => {
  const { wordList, curWord, correctLetters, lifeLeft } = this.state;
  const word = wordList[curWord]?.toLowerCase() || '';
  const uniqueLetters = [...new Set(word.split(''))];

  if (lifeLeft >= 6) {
    setTimeout(() => {
      alert("Game Over!");
      this.startNewGame();
    }, 100); 
  } else if (uniqueLetters.every(l => correctLetters.includes(l))) {
    setTimeout(() => {
      alert("You Win!");
      this.startNewGame();
    }, 100);
  }
};


  renderLetterButtons = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    const { usedLetters, correctLetters } = this.state;

    return alphabet.map(letter => {
      const isUsed = usedLetters.includes(letter);
      const isCorrect = correctLetters.includes(letter);
      const bgColor = !isUsed ? "black" : isCorrect ? "green" : "red";

      return (
        <button
          key={letter}
          onClick={() => this.handleSearch(letter)}
          disabled={isUsed}
          style={{
            backgroundColor: bgColor,
            color: "white",
            margin: "3px",
            padding: "10px",
            borderRadius: "5px",
            cursor: isUsed ? "not-allowed" : "pointer"
          }}
        >
          {letter.toUpperCase()}
        </button>
      );
    });
  };

 render() {
  const { wordList, curWord, lifeLeft } = this.state;
  const word = wordList[curWord] || '';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      textAlign: 'center',
      minHeight: '100vh',
      position: 'relative'
    }}>

      {/* Lives Left Counter - Top Right */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '20px',
        fontSize: '20px',
        fontWeight: 'bold',
        background: 'rgba(0,0,0,0.1)',
        padding: '5px 10px',
        borderRadius: '8px'
      }}>
        Lives Left: {6 - lifeLeft}
      </div>

      {/* Hangman Image */}
      <img src={pics[Math.min(lifeLeft, pics.length - 1)]} alt="Hangman stage" style={{ width: '200px', height: 'auto' }} />

      <br />
      <button onClick={this.startNewGame}>New Game</button>

      {/* Underscore Word Display */}
      <p style={{ fontSize: "24px", letterSpacing: "8px" }}>
        {word
          .toLowerCase()
          .split("")
          .map((char, index) =>
            this.state.correctLetters.includes(char) ? char.toUpperCase() : "_"
          )
          .join(" ")
        }
      </p>

      <SingleLetterSearchBar onSearch={this.handleSearch} />

      <div style={{ marginTop: '20px' }}>
        {this.renderLetterButtons()}
      </div>
    </div>
  );
}
n


}

export default HangmanGame;
