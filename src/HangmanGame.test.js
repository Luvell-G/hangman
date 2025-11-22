// HangmanGame.js
import React from 'react';
import './App.css';
import Login from './Login';
import SingleLetterSearchBar from './SingleLetterSearchBar';

const pics = [
  'noose.png',
  'upperBody.png',
  'upperandlowerbody.png',
  '1arm.png',
  'botharms.png',
  '1leg.png',
  'dead.png'
];

const words = [
  "Morehouse", "Spelman", "Basketball", "Table",
  "Museum", "Excellent", "Fun", "React"
];

class HangmanGame extends React.Component {
  state = {
    wordList: words,
    curWord: 0,
    lifeLeft: 0,
    usedLetters: [],
    correctLetters: [],

    // Player State
    playerName: "",
    wins: 0,
    losses: 0,
    isLoggedIn: false
  };

  componentDidMount() {
    this.startNewGame();
  }

  // -----------------------------
  // LOGIN CALLBACK
  // -----------------------------
  handleLogin = (playerData) => {
    this.setState({
      playerName: playerData.playerName,
      wins: playerData.wins,
      losses: playerData.losses,
      isLoggedIn: true
    });
  };

  // -----------------------------
  // START NEW GAME
  // -----------------------------
  startNewGame = () => {
    this.setState({
      curWord: Math.floor(Math.random() * words.length),
      lifeLeft: 0,
      usedLetters: [],
      correctLetters: []
    });
  };

  // -----------------------------
  // HANDLE LETTER INPUT
  // -----------------------------
  handleSearch = (letter) => {
    letter = letter.toLowerCase();
    const { usedLetters, correctLetters, wordList, curWord } = this.state;

    if (usedLetters.includes(letter)) return;

    const word = wordList[curWord].toLowerCase();
    const isCorrect = word.includes(letter);

    this.setState(prev => ({
      usedLetters: [...prev.usedLetters, letter],
      correctLetters: isCorrect
        ? [...prev.correctLetters, letter]
        : prev.correctLetters,
      lifeLeft: isCorrect ? prev.lifeLeft : prev.lifeLeft + 1
    }), this.checkGameStatus);
  };

  // -----------------------------
  // CHECK WIN / LOSS
  // -----------------------------
  checkGameStatus = () => {
    const { wordList, curWord, correctLetters, lifeLeft } = this.state;
    const word = wordList[curWord].toLowerCase();
    const uniqueLetters = [...new Set(word)];

    if (lifeLeft >= 6) {
      this.addLoss();
      setTimeout(() => {
        alert("Game Over!");
        this.startNewGame();
      }, 200);
    }

    if (uniqueLetters.every(l => correctLetters.includes(l))) {
      this.addWin();
      setTimeout(() => {
        alert("You Win!");
        this.startNewGame();
      }, 200);
    }
  };

  // -----------------------------
  // UPDATE STATS TO DB
  // -----------------------------
  sendStatsToDB = async () => {
    const { playerName, wins, losses } = this.state;

    await fetch("http://localhost:3001/api/player", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName, wins, losses })
    });
  };

  addWin = () => {
    this.setState(prev => ({ wins: prev.wins + 1 }), this.sendStatsToDB);
  };

  addLoss = () => {
    this.setState(prev => ({ losses: prev.losses + 1 }), this.sendStatsToDB);
  };

  // -----------------------------
  // RENDER LETTER BUTTONS
  // -----------------------------
  renderLetterButtons = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    const { usedLetters, correctLetters } = this.state;

    return alphabet.map(letter => {
      const used = usedLetters.includes(letter);
      const correct = correctLetters.includes(letter);
      const bg = !used ? "black" : correct ? "green" : "red";

      return (
        <button
          key={letter}
          disabled={used}
          onClick={() => this.handleSearch(letter)}
          style={{
            backgroundColor: bg,
            color: "white",
            margin: "3px",
            padding: "10px",
            borderRadius: "5px",
            cursor: used ? "not-allowed" : "pointer"
          }}
        >
          {letter.toUpperCase()}
        </button>
      );
    });
  };

  // -----------------------------
  // RENDER UI
  // -----------------------------
  render() {
    const {
      wordList, curWord, lifeLeft,
      playerName, isLoggedIn, wins, losses
    } = this.state;

    const word = wordList[curWord];

    return (
      <div style={{
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>

        {/* ✅ LOGIN OVERLAY CENTERED */}
        {!isLoggedIn && (
          <Login onLogin={this.handleLogin} />
        )}

        {/* ✅ PLAYER INFO AFTER LOGIN */}
        {isLoggedIn && (
          <div style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            background: "rgba(0,0,0,0.1)",
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "bold"
          }}>
            Player: {playerName} <br />
            Wins: {wins} | Losses: {losses} <br />
            Win %: {(wins + losses === 0 ? 0 :
              (wins / (wins + losses)) * 100).toFixed(1)}%
          </div>
        )}

        {/* ✅ LIVES DISPLAY */}
        <div style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          fontSize: "20px",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.1)",
          padding: "8px",
          borderRadius: "8px"
        }}>
          Lives Left: {6 - lifeLeft}
        </div>

        {/* ✅ GAME UI ONLY SHOWS AFTER LOGIN */}
        {isLoggedIn && (
          <>
            <img
              src={pics[Math.min(lifeLeft, pics.length - 1)]}
              alt="Hangman stage"
              style={{ width: "200px", marginTop: "60px" }}
            />

            <button style={{ marginTop: "20px" }} onClick={this.startNewGame}>
              New Game
            </button>

            <p style={{ fontSize: "28px", letterSpacing: "10px", marginTop: "20px" }}>
              {word
                .split("")
                .map(letter =>
                  this.state.correctLetters.includes(letter.toLowerCase())
                    ? letter.toUpperCase()
                    : "_"
                )
                .join(" ")
              }
            </p>

            <SingleLetterSearchBar onSearch={this.handleSearch} />

            <div style={{ marginTop: "20px" }}>
              {this.renderLetterButtons()}
            </div>
          </>
        )}

      </div>
    );
  }
}

export default HangmanGame;
